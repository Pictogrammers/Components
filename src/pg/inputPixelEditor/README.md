# `<pg-input-pixel-editor>`

The `pg-input-pixel-editor` component is used to edit images. Tailored for pen or mouse input the editor can be used for various image editing tasks.

```typescript
import '@pictogrammers/components/pgInputPixelEditor';
import { PgInputPixelEditor } from '@pictogrammers/components/pgInputPixelEditor';
```

```html
<pg-input-pixel-editor></pg-input-pixel-editor>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| name        |          | Unique name in `pg-form` |
| width       |          | Pixel width. Default `10` |
| height      |          | Pixel height. Default `10` |
| size        |          | Pixel size, minimum value `4`. Default `10` |
| gridSize    |          | Grid spacing between cells. Default `1` |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value }` |
| input      |          | `{ detail: { value }` |

## Methods

See usage for each method below.

| Method     | Tested   | Description |
| ---------- | -------- | ----------- |
| `save(callback, options)` | -        | Save file. |
| `open(file, callback)` | -        | Open file. |
| undo() | -           | Undo. |
| hasUndo() | -     | Has undo |
| hasRedo() | -     | Has redo |
| redo() | -           | Redo. |
| selectLayer() | -    |       |
| getLayers() | -    | Get layer array. |
| addLayer(option) | -        | Add layer. |
| removeLayer(index) | -      | Remove layer. |
| rotateClockwise() | -    | Rotate. |
| rotateCounterclockwise() | -    | Rotate. |
| move(x, y[, layer]) | -  | Move canvas. |
| flipHorizontal() |
| flipVertical() |