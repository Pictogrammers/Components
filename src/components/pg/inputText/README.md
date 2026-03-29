# `<pg-input-text>`

The `pg-input-text` component creates an input that accepts text input.

```typescript
import '@pictogrammers/components/pgInputText';
import { PgInputText } from '@pictogrammers/components/pgInputText';
```

```html
<pg-input-text value="50"></pg-input-text>
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

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-input-text-padding-inline` | `0.5rem` | Padding inline. |
| `--pg-input-text-padding-inline-start` | `0.5rem` | Padding inline start. |
| `--pg-input-text-padding-inline-end` | `0.5rem` | Padding inline end. |
| `--pg-input-text-padding-block` | `0.25rem` | Padding block. |
| `--pg-input-text-padding-block-start` | `0.25rem` | Padding block start. |
| `--pg-input-text-padding-block-end` | `0.25rem` | Padding block end. |