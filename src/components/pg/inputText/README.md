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
