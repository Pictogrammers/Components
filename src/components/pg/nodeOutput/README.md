# `<pg-nodes>`

The `pg-nodes` component allows creating and linking `PgNode` extended data types.

> If a `type` is omitted a `fields` property is required. See below for details.

```typescript
import '@pictogrammers/components/pgNodeEditorText';
import { PgNodeEditorText } from '@pictogrammers/components/pgNodeEditorText';
```

```html
<pg-node-editor-text></pg-node-editor-text>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| `items`     |          | Node list |

> Note: All nodes are sized off a `1rem` grid.

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { index, item[, field] }` |
| input      |          | `{ detail: { index, item[, field] }` |

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| n/a   |  |  |
