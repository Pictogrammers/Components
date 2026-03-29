# `<pg-input-textarea>`

The `pg-input-textarea` component creates an input that accepts multiline text. Additionally it can resize.

```typescript
import '@pictogrammers/components/pgInputTextarea';
import { PgInputTextarea } from '@pictogrammers/components/pgInputTextarea';
```

```html
<pg-input-textarea value="50"></pg-input-textarea>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| name        |          | Unique name in `pg-form` |
| value       |          | Field value |
| placeholder |          | Placeholder text |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value }` |
| input      |          | `{ detail: { value }` |
| caret      |          | `{ detail: { column, row }}` |

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-input-textarea-padding-inline` | `0.5rem` | Padding inline. |
| `--pg-input-textarea-padding-inline-start` | `0.5rem` | Padding inline start. |
| `--pg-input-textarea-padding-inline-end` | `0.5rem` | Padding inline end. |
| `--pg-input-textarea-padding-block` | `0.25rem` | Padding block. |
| `--pg-input-textarea-padding-block-start` | `0.25rem` | Padding block start. |
| `--pg-input-textarea-padding-block-end` | `0.25rem` | Padding block end. |