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
| `name`      |          | Unique name in `pg-form` |
| `width`     |          | Pixel width. Default `10` |
| `height`    |          | Pixel height. Default `10` |
| `size`      |          | Pixel size, minimum value `4`. Default `10` |
| `gridSize`  |          | Grid spacing between cells. Default `1` |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| `change`   |          | `{ detail: { value }` |
| `input`    |          | `{ detail: { value }` |

## Methods

See usage for each method below.

| Method     | Tested   | Description |
| ---------- | -------- | ----------- |
| `save(options)` | -        | Save file. |
| `open(json)` | -        | Open file. |
| `undo()` | -           | Undo. |
| `hasUndo()` | -     | Has undo |
| `hasRedo()` | -     | Has redo |
| `redo()` | -           | Redo. |
| `selectLayer()` | -    | Select layer. |
| `getLayers()` | -    | Get layer array. |
| `addLayer(option)` | -        | Add layer. |
| `removeLayer(index)` | -      | Remove layer. |
| `moveLayer(startIndex, endIndex)` | -    | Move layer. |
| `getColors()` | -    | Get colors. |
| `addColor(r, g, b, a)` | -    | Add color. |
| `removeColor(index)` | -    | Remove color. |
| `moveColor(startIndex, endIndex)` | -    | Move index. |
| `rotateClockwise()` | -    | Rotate. |
| `rotateCounterclockwise()` | -    | Rotate. |
| `move(x, y[, layer])` | -  | Move. |
| `flipHorizontal()` | -  | Flip horizontal. |
| `flipVertical()` | -  | Flip vertical. |
| `invert()` | -  | Invert layer. |

### `save(options)` Method

The save method allows getting the JSON representation of the current editor.

```typescript
@Part() $editor: PgInputPixelEditor;

handleSave() {
  const json = await this.$editor.save({
    // Include history
    history: true,
  });
  // use json
}
```

### `open(json)` Method

The open method allows loading json for previously created images.

```typescript
@Part() $editor: PgInputPixelEditor;

handleOpen() {
  const error = await this.$editor.open(json);
  if (error) {
    throw new Error(error.message);
  }
}
```

## JSON Format

- `width` - Image width.
- `height` - Image width.
- `transparent` - Render transparent background.

A complete JSON storage for a 10x10 image.

```json
{
  "width": 10,
  "height": 10,
  "transparent": true,
  "colors": [
    [0, 0, 0, 0],
    [0, 0, 0, 1]
  ],
  "layers": [
    {
      "name": "Layer 1",
      "export": true,
      "locked": false,
      "visible": true,
      "opacity": 1
    }
  ],
  "data": [
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  ]
}
```
