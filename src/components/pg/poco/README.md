# `<pg-poco>`

The `<pg-poco>` component allows creating an emulator that simulates the draw commands for the Moddable SDK.

## Usage

See the demo for examples.

## Timer

Equivalent to `setInterval`.

```typescript
const id = Timer.set(() => {

// delay, interval
}, 1000, 1000);

// Timer.clear(id);
```

For `setTimeout` leave off the `interval` value or set it to `0`.
