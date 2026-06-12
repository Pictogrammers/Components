# Preview Sub-Grid Offset Bug

## The Problem

When `snap` fires it updates the node's x/y/width/height via `emit`. That moves the CSS
anchor. The preview CSS vars must then represent the **remaining sub-grid offset** so the
overlay tracks the cursor smoothly. If the formula is wrong, the overlay jumps by ~gridSize
pixels at each snap boundary.

## dragUtil snap algorithm (asymmetric — the root bug)

```
snapDx = (lastDx + half < 0)
  ? Math.ceil((lastDx + half) / gridSize)   // negative direction: ceil
  : Math.floor((lastDx + half) / gridSize)  // positive direction: floor
```

Because of ceil vs floor the first snap threshold is **asymmetric**:
- Positive drag: first snap at +8 px  (half grid unit) ← works correctly (south)
- Negative drag: first snap at -24 px (1.5 grid units) ← broken (north)

Negative example step-by-step with gridSize=16, half=8:
  dy=-8:  (-8+8)/16 = 0/16 = 0,    ceil(0) = 0   → no snap yet
  dy=-16: (-16+8)/16 = -8/16 = -0.5, ceil(-0.5) = 0 → still no snap
  dy=-24: (-24+8)/16 = -16/16 = -1,  ceil(-1)  = -1 → FIRST snap (at 1.5 grid units!)

**Fix: use Math.floor for ALL values** — this rounds toward −∞ symmetrically:
  dy=+8:  floor((8+8)/16)  = floor(1)      = 1   → snap ✓
  dy=-8:  floor((-8+8)/16) = floor(0)      = 0   → no snap yet
  dy=-9:  floor((-9+8)/16) = floor(-0.0625)= -1  → snap (≈half grid unit) ✓

## Correct sub-grid formula

The correct sub-grid residual (pixels past the last snap) must mirror the same algorithm:

```ts
subGrid(delta) = delta - (
  delta + half < 0
    ? Math.ceil((delta + half) / gridSize) * gridSize
    : Math.floor((delta + half) / gridSize) * gridSize
)
```

## Why the existing formulas fail

`delta % gridSize` (used by previewX/Y/Width):
- delta = -20 → -20 % 16 = -4  (JS truncated modulo)
- correct: no snap at -20 (threshold is -24), so sub-grid = -20
- WRONG by 16 px

`((delta + half) % gridSize) - half` (used by previewHeight):
- delta = 9 → ((17) % 16) - 8 = -7  ✓ (correct, snap fired at +8)
- delta = -20 → ((-12) % 16) - 8 = -12 - 8 = -20  ✓ (correct, no snap yet)
- delta = -9 → ((-1) % 16) - 8 = -1 - 8 = -9  
  - correct: snap fires at -24, so sub-grid = -9  ✓ happens to be right

## Why the west/north handles jump but south mostly does not

For south (hDir=1), dy is positive when the height grows (normal use). The previewHeight
formula is correct for positive dy. Negative dy (shrinking the south edge) rarely reaches
the problematic range.

For north (hDir=-1), the previewY/previewWidth/previewX use `% gridSize` which is
wrong in the range (-24, -16) for dx/dy values.

## Critical insight about width/x coupling

For a west handle (wDir=-1), dx is the raw pointer delta:
- x sub-grid  = subGrid(dx)
- width sub-grid = -subGrid(dx)  ← NOT subGrid(-dx)

`subGrid` is NOT an odd function (asymmetric snap means subGrid(-dx) ≠ -subGrid(dx)).
So calling previewWidth(-dx) with an internal formula on -dx is wrong.

## Fix

Compute `sgX = subGrid(dx)` and `sgY = subGrid(dy)` once per `move` event, then:
- delta-x   = sgX          (when wDir == -1)
- delta-width = wDir * sgX  (when wDir != 0)
- delta-y   = sgY          (when hDir == -1)
- delta-height = hDir * sgY (when hDir != 0)
