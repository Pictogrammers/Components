# `<pg-input-pixel-editor>`

The `pg-input-pixel-editor` component is used to edit images. Tailored for pen or mouse input the editor can be used for various image editing tasks.

```typescript
import '@pictogrammers/components/pg/inputPixelEditor';
import PgInputPixelEditor, {
  InputMode,
  LayerType,
} from '@pictogrammers/components/pg/inputPixelEditor';
```

```html
<pg-input-pixel-editor></pg-input-pixel-editor>
```

## Attributes

| Attributes    | Tested   | Description |
| ------------- | -------- | ----------- |
| `width`       |          | Pixel width. Default `10` |
| `height`      |          | Pixel height. Default `10` |
| `size`        |          | Pixel size, minimum value `4`. Default `10` |
| `gridSize`    |          | Grid spacing between cells. Default `1` |
| `transparent` |          | Show checkerboard background. Default `false` |
| `placeholder` |          | Placeholder text |

## Events

| Events      | Tested   | Description |
| ----------- | -------- | ----------- |
| `change`    |          | `{ detail: { value }` |
| `reference` |          | `{ detail: { id, callback } }` |

```typescript
this.$input.addEventListener('reference', (e: any) => {
  const { id, callback } = e.detail;
  // async request
  // callback(file: File)
});
```

## Methods

See usage for each method below.

| Method     | Tested   | Description |
| ---------- | -------- | ----------- |
| `getJson(options)` | -        | Get JSON file. |
| `setJson(json)` | -        | Set JSON file. |
| `getData()` | -           | Get layer data as paths by color. |
| `setData(data)` | -           | Set layer data from paths. |
| `reset()` | -  | Reset canvas and data. |
| `getExport()` | -  | 2d array of pixel color indexes. Already calculated. |
| `getExportCanvas(options)` | -  | Get new prepopulated HTML canvas, ideal for advanced export screens. |
| `await getExportPng(options, meta)` | -  | Get png image with optional metadata. |
| `await getSelectionPng(options, meta)` | -  | Get png of the current selection bounding box. |
| `undo()` | -           | Undo. |
| `hasUndo()` | -     | Has undo. |
| `hasRedo()` | -     | Has redo. |
| `redo()` | -           | Redo. |
| `getHistory()` | -  | History list. |
| `clearHistory()` | -  | Clear undo/redo history. |
| `inputModeCursor()` | -  | Input Mode Cursor — click to select layer. |
| `inputModeSelectRectangle()` | -  | Input Mode Select Rectangle. |
| `inputModeSelectEllipse()` | -  | Input Mode Select Ellipse. |
| `inputModeSelectLasso()` | -  | Input Mode Lasso. |
| `inputModeSelectMagicWand()` | -  | Input Mode Magic Wand. |
| `inputModePixel()` | -  | Input Mode Pixel. |
| `inputModeStamp(stamp)` | -  | Input Mode Stamp. |
| `inputModeLine()` | -  | Input Mode Line. |
| `inputModeRectangle()` | -  | Input Mode Rectangle. |
| `inputModeRectangleOutline()` | -  | Input Mode Rectangle Outline. |
| `inputModeEllipse()` | -  | Input Mode Ellipse. |
| `inputModeEllipseOutline()` | -  | Input Mode Ellipse Outline. |
| `selectLayers(indexes)` | -    | Select one or more layers by index array. |
| `getLayers()` | -    | Get layer index array. |
| `addLayer(option)` | -        | Add layer. `name`, `type` required. |
| `removeLayer(index)` | -      | Remove layer by index. |
| `flattenLayers(layerIndexes)` | -      | Flatten layers (not yet implemented). |
| `getColor(index)` | -     | Get color by index. |
| `getColors()` | -    | Get all colors. |
| `getLayerColorIndexes(layerIndex?)` | -  | Get unique color indexes on selected (or given) layer. |
| `getLayerPaths()` | -  | Get SVG path strings per color per layer. |
| `selectColor(index)` | -    | Set the active draw color. |
| `setColor(index, r, g, b, a)` | -  | Update a color by index. |
| `addColor(r, g, b, a)` | -    | Append a color. |
| `removeColor(index)` | -    | Remove a color by index. |
| `moveColor(startIndex, endIndex)` | -    | Move a color (not yet implemented). |
| `rotateClockwise()` | -    | Rotate active layer 90° clockwise. |
| `rotateCounterclockwise()` | -    | Rotate active layer 90° counter-clockwise. |
| `move(x, y)` | -  | Translate active layer by x/y pixels. |
| `flipHorizontal()` | -  | Flip active layer horizontally. |
| `flipVertical()` | -  | Flip active layer vertically. |
| `invert()` | -  | Invert active layer (2-color only). |
| `outline(include?)` | -  | Draw outline around active layer with selected color. |
| `glow(include?)` | -  | Draw glow (outer outline) with selected color. |
| `applyGuides()` | -  | Draw guide lines onto the base layer. |
| `drawGrid(grid, layer?)` | -  | Draw a full 2d color-index grid onto a layer. |
| `drawPixel(x, y, color, layer?)` | -  | Draw a single pixel. |
| `hasSelection()` | -  | Returns true when pixels are selected. |
| `getSelection()` | -  | Get selection pixels (not yet implemented). |
| `clearSelection()` | -  | Deselect all pixels. |
| `moveSelection(x, y)` | -    | Translate selection and its pixels by x/y. |

### `getJson(options)` Method

The `getJson` method allows getting the JSON representation of the current editor. Optionally this can snapshot the entire undo history. To get only data by layer call `getData()`.

```typescript
@Part() $editor: PgInputPixelEditor;

async handleSave() {
  const json = await this.$editor.getJson({
    // Include history
    history: true,
  });
  // use json
}
```

### `setJson(json)` Method

The `setJson` method loads a previously saved JSON file into the editor.

```typescript
@Part() $editor: PgInputPixelEditor;

async handleOpen(json) {
  await this.$editor.setJson(json);
}
```

## Events

### `change`

### `selectLayer`

Using `InputMode.Cursor` individual pixels can be clicked on to select the layer. Note, selecting a layer does not automatically select it. The event must be handled.

```typescript
this.$input.addEventListener('selectlayer', (e: any) => {
  const { color, index } = e.detail;
  this.selectLayers([index]);
})
```

## JSON Format

- `width` - Image width.
- `height` - Image width.
- `transparent` - Override the transparent color. This has no impact on the exported background.

A complete JSON storage for a 10x10 image.

```json
{
  "width": 10,
  "height": 10,
  "gridSize": 10,
  "transparent": null,
  "colors": [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [255, 255, 255, 1]
  ],
  "layers": [
    {
      "name": "Layer 1",
      "exclude": false,
      "locked": false,
      "hidden": false,
      "type": "pixel",
      "opacity": 1
    }
  ],
  "data": [
    [
      [{ "color": 1, "path": "M...Z" }],
      [{ "color": 2, "path": "M...Z" }]
    ]
  ],
  "grid": {
    "vertical": [],
    "horizontal": []
  },
  "exports": [],
  "history": []
}
```

## Layer Type

There are currently 6 differnet layer types.

- `pixel` - Raster artboard of pixels.
  - `color: 0` - colorIndex
  - `path: ''` - pixels
- `reference`
  - `id: 'uuid'` - uuid of frame
  - `position: [x, y]`
- `pattern` - Repeat an existing frame
  - `id: 'uuid'` - uuid of frame
  - `position: [x, y]` - required
  - `size: [x, y]` - optional, size to clip at
  - `offset [x, y]` - optional, offset pattern
- `linear` - Linear gradient.
  - `start: [x, y]`
  - `end: [x, y]`
  - `path: ''` - optional, mask
  - `stops: [[stop, colorIndex], [stop, colorIndex]]`
  - `dither: 'bayer4' | 'bayer8', 'bayer16'`
- `radial` - Radial gradients.
  - `start: [x, y]`
  - `end: [x, y]`
  - `transform: [1, 0, 0, 0.5, 0, 0]` to create ellipses
  - `stops: [[stop, colorIndex], [stop, colorIndex]]`
  - `dither: 'bayer4' | 'bayer8' | 'bayer16'`
- `text` - Text, maybe???
  - `id: 'uuid'` - file uuid
  - `value: ''` - string

### Layer `pixel` Type

The most common layer type.

```json
{
  "data": [
    [
      { "color": 1, "path": "M...Z" },
      { "color": 2, "path": "M...Z" }
    ]
  ]
}
```

### Layer `reference` Type

Using an existing canvas in a design can be done with a reference layer.

```json
{
  "data": [
    [{ "id": "uuid", "position": [0, 0] }]
  ]
}
```

### Layer `pattern` Type

Using an existing canvas, but in a repeating pattern.

```json
{
  "data": [
    [{ "id": "uuid", "position": [0, 0], "size": [100, 100] }],
    [{ "id": "uuid", "position": [0, 0], "offset": [0, -2] }]
  ]
}
```

### Layer `linear` / `radial` Type

Linear and radial gradient between 2 points. Both allow a mask to be applied.

```json
{
  "data": [
    [{ "id": "uuid", "start": [0, 0], "end": [100, 100] }],
    [{ "id": "uuid", "start": [0, 0], "end": [100, 0], "stops": [] }]
  ]
}
```

### Layer `text` Type

Pull down a known font and use it as a reference.

```json
{
  "data": [
    [{ "id": "uuid", "value": "Hello World!", "position": [0, 0] }],
    [{ "id": "uuid", "value": "Hello World!", "position": [0, 0], "wrap": 100 }]
  ]
}
```

If a `id` is not found in the current file it will call the `reference` event. This event will need to return the found file to the `callback`. This could slow down initial project load.

```typescript
this.$input.addEventListener('reference', (e: any) => {
  const { id, callback } = e.detail;
  if (id === 'uuid') {
    callback(file);
  }
});
```

## Grid

Grids seperate the frame into regions. The vertical and horizontal lines can be assigned a unique color often used in fonts.

Grid lines on 0 or when equal or greater than to width/height are deleted. Applying a grid or resizing a frame will result in an error. Errors are handled by the consumer via the `error` event. `errorType: 'grid'`.

```text
0, 0 | 1, 0 | 2, 0
0, 1 | 1, 1 | 2, 1
0, 2 | 1, 2 | 2, 2
```

An example of a 9 segment grid for instance. Negative values offset from the right or bottom.

> Note: When configuring exports all grid colors with `color: 0` will be visible.

```json
{
  "grid": [{
    "vertical": [
      { "offset": 10, "color": 0 },
      { "offset": -10, "color": 0 }
    ],
    "horizontal": [
      { "offset": 10, "color": 0 },
      { "offset": -10, "color": 0 }
    ]
  }]
}
```

Specific grid colors are configured on the editor level and do not persist in this input component. In a font the first 5 colors are reserved for the below lines.

- `1` - Ascender Line
- `2` - Cap Line
- `3` - Median / Mean line
- `4` - Baseline
- `5` - Decender Line

### Repeating Grids

A repeating grid is useful for tilesets and can be represented as.
- `offset` can be optional or null when `step` is defined.
- `limit` can be optional or null. Null repeats for as many times as it can fit.
- Similar to regular grids an error will throw if the first line is outside the `width` or `height`.

To create a repeating 20 pixel grid without an offset.

```json
{ "step": 20, "color": 0 },
```

To create a repeating 10 pixel grid with an offset `5` and limit `10`. The use case of this would be comps where a tileset does not evently sit in a viewport and needs to be centered.

```json
{ "offset": 5, "step": 10, "limit": 10, "color": 0 },
```

## Export

Exports by default include the entire canvas, but can be resized to a specific pixel size or grid. The `x`, `y`, `width`, and `height` are optional.

Use `getExport()` to get the cached 2d color-index grid. Use `getExportCanvas(options)` with `x`, `y`, `width`, `height` to crop to a region — ideal for export previews.

```json
{
  "exports": [{
    "id": "uuid",
    "unit": "pixel",
    "path": ["file.png"],
    "x": 0,
    "y": 0,
    "width": null,
    "height": null,
  }, {
    "id": "uuid",
    "unit": "grid",
    "path": ["folder", "bottomRight.png"],
    "x": 2,
    "y": 2,
    "width": 1,
    "height": 1,
  }]
}
```

## History

The history list contains every change made to the canvas. All feature insert an entry into history. Pens and pattern tools will group as to cut down history entries.

Note: Calling the `draw*()` commands programmatically will group into a single history item.

- Undo a change
- Redo an undo
- Timeline - Commonly used to generate progression clips. `getHistoryGif({ delay: 0.05 })` for instance generates a gif with 0.05 second delay between each change.

### History Format

For plugins or tools generating timelines the `getHistory()` returns an array with all entries. Note the `getHistoryPng(index)` is very CPU intensive and will recreate every change up to the index.

```json
[       // history
  [     // history item
    {}, // group
    {}
  ]
]
```
