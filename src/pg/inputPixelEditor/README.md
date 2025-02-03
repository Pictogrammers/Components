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
| value       |          | Field value |
| width       |          | Pixel width. Default `10` |
| height      |          | Pixel height. Default `10` |
| size        |          | Pixel size, minimum value `4`. Default `10` |
| gridSize    |          | Grid spacing between cells. Default `1` |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value }` |
| input      |          | `{ detail: { value }` |
