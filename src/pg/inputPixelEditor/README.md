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
| `undo()` | -           | Undo. |
| `hasUndo()` | -     | Has undo |
| `hasRedo()` | -     | Has redo |
| `redo()` | -           | Redo. |
| `inputModeSelectRectangle()` | -  | Input Mode Select Rectangle |
| `inputModeSelectEllipse()` | -  | Input Mode Select Ellipse |
| `inputModeSelectLasso()` | -  | Input Mode Lasso |
| `inputModeSelectMagicWand()` | -  | Input Mode Magic Wand |
| `inputModePixel()` | -  | Input Mode Pixel |
| `inputModeStamp(stamp)` | -  | Input Mode Stamp |
| `inputModeLine()` | -  | Input Mode Line |
| `inputModeRectangle()` | -  | Input Mode Rectangle |
| `inputModeRectangleOutline()` | -  | Input Mode Rectangle Outline |
| `inputModeEllipse()` | -  | Input Mode Ellipse |
| `inputModeEllipseOutline()` | -  | Input Mode Ellipse Outline |
| `selectLayer(index)` | -    | Select layer. |
| `getLayers()` | -    | Get layer array. |
| `addLayer(option)` | -        | Add layer. |
| `removeLayer(index)` | -      | Remove layer. |
| `flattenLayers(layerIndexes)` | -      | Flatten layers. |
| `moveLayer(startIndex, endIndex)` | -    | Move layer. |
| `getColor()` | -     | Get selected color |
| `getColors()` | -    | Get colors. |
| `getLayerColorIndexes()` | -  | Get selected layer colors. |
| `selectColor(index)` | -    | Select color. |
| `setColor(index, r, g, b, a)` | -  | Set Color. |
| `addColor(r, g, b, a)` | -    | Add color. |
| `removeColor(index)` | -    | Remove color. |
| `moveColor(startIndex, endIndex)` | -    | Move index. |
| `rotateClockwise()` | -    | Rotate. |
| `rotateCounterclockwise()` | -    | Rotate. |
| `move(x, y[, layer])` | -  | Move. |
| `getSelection()` | -  | Get selection pixels. |
| `clearSelection()` | -  | Clear selection. |
| `flipHorizontal()` | -  | Flip horizontal selection. |
| `flipVertical()` | -  | Flip vertical selection. |
| `invert()` | -  | Invert layer. |
| `outline()` | -  | Outline layer with selected color. |
| `glow()` | -  | Glow layer with selected color. |

### `getJson(options)` Method

The `getJson` method allows getting the JSON representation of the current editor. Optionally this can snapshot the entire undo history.

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

### `setJson(json)` Method

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
- `transparent` - Override the transparent color. This has no impact on the exported background.

A complete JSON storage for a 10x10 image.

```json
{
  "width": 10,
  "height": 10,
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
      [1, "M...Z"],
      [2, "M...Z"]
    ]
  ]
}
```

## Layer Type

There are currently 6 differnet layer types.

- `pixel` - Raster artboard of pixels.
  - `path` - pixels
  - `color` - colorIndex
- `reference`
  - `id` - uuid of frame
  - `position: [x, y]`
- `pattern` - Repeat an existing frame
  - `path` - pixels
  - `id` - uuid of frame
  - `offset [x, y]` - offset pattern
- `linear` - Linear gradient.
  - `start: [x, y]`
  - `end: [x, y]`
  - `stops: [[stop, colorIndex], [stop, colorIndex]]`
  - `dither: 'bayer4' | 'bayer8', 'bayer16'`
- `radial` - Radial gradients.
  - `start: [x, y]`
  - `end: [x, y]`
  - `transform: [1, 0, 0, 0.5, 0, 0]` to create ellipses
  - `stops: [[stop, colorIndex], [stop, colorIndex]]`
  - `dither: 'bayer4' | 'bayer8' | 'bayer16'`
- `text` - Text, maybe???
  - `id` - file uuid
  - `value` - string