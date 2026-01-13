# `<pg-input-number>`

The `pg-input-number` component creates an input that accepts number input.

```typescript
import '@pictogrammers/components/pgInputNumber';
import PgInputNumber from '@pictogrammers/components/pgInputText';
```

```html
<pg-input-number value="50"></pg-input-number>
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
