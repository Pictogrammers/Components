# `<pg-input-number>`

The `pg-input-number` component creates an input that accepts number input.

```typescript
import '@pictogrammers/components/pgInputNumber';
import PgInputNumber from '@pictogrammers/components/pgInputText';
```

```html
<pg-input-number part="input" value="50"></pg-input-number>
```

```typescript
// handle plus and minus buttons
this.$input.addEventListener('input', (e: any) => {
  const { value } = e.detail;
  this.$input.value = value;
});
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| name        |          | Unique name in `pg-form` |
| value       |          | Field value |
| step        |          | Default `1` |
| min         |          | Default `-1 * Number.MAX_SAFE_INTEGER` |
| max         |          | Default `Number.MAX_SAFE_INTEGER` |
| placeholder |          | Placeholder text |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value, name }` |
| input      |          | `{ detail: { value, name }` |
