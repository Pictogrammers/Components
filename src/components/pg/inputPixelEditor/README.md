# `<pg-input-pixel-editor>`

The `pg-input-pixel-editor` component is used to edit images. Tailored for pen or mouse input the editor can be used for various image editing tasks.

```typescript
import '@pictogrammers/components/pgInputPixelEditor';
import PgInputPixelEditor, {
  InputMode,
  LayerType,
} from '@pictogrammers/components/pgInputPixelEditor';
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
| `getData()` | -           | Get layer data. |
| `setJson(json)` | -        | Set JSON file. |
| `reset()` | -  | Reset canvas and data. |
| `getExportCanvas()` | -  | Get new canvas of export. |
| `await getExportPng(options, meta)` | -  | Get image. |
| `undo()` | -           | Undo. |
| `hasUndo()` | -     | Has undo |
| `hasRedo()` | -     | Has redo |
| `redo()` | -           | Redo. |
| `getHistory()` | -  | History list. |
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
| `moveSelection(x, y)` | -    | Move selection. |
| `flipHorizontal()` | -  | Flip horizontal selection. |
| `flipVertical()` | -  | Flip vertical selection. |
| `invert()` | -  | Invert layer. |
| `outline()` | -  | Outline layer with selected color. |
| `glow()` | -  | Glow layer with selected color. |
| `drawPixels([[x, y, color], ...])` | -  | Draw pixels. Color optional. |
| `drawRectangle(x, y, width, height, isOutline)` | -  | Draw rectangle |
| `drawEllipse(x, y, width, height, isOutline)` | -  | Draw ellipse. |
| `drawLine()` | -  | Draw line. |
| `flush()` | -  | Flush changes to history. |

### `getJson(options)` Method

The `getJson` method allows getting the JSON representation of the current editor. Optionally this can snapshot the entire undo history. To get only data by layer call `getData()`.

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

## History

The history list contains every change made to the canvas. All feature insert an entry into history. Pens and pattern tools will group as to cut down history entries.

Note: Calling the `draw*()` commands programatically will group into a single history item. To create multiple entries call `flush()`.

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
