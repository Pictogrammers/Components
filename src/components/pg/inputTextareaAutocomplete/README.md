# `<pg-input-textarea-autocomplete>`

The `pg-input-textarea-autocomplete` component supports everything `pg-input-textarea` and adds tracking for the caret position implementing a list of options.

```typescript
import '@pictogrammers/components/pgInputTextareaAutocomplete';
import { PgInputTextarea } from '@pictogrammers/components/pgInputTextareaAutocomplete';
```

```html
<pg-input-textarea-autocomplete value="50"></pg-input-textarea-autocomplete>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| name        |          | Unique name in `pg-form` |
| value       |          | Field value |
| placeholder |          | Placeholder text |

## Methods

### `setOptions`

```typescript
this.$input.setOptions([{
  label: 'name',
  value: 'name'
}]);
```

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value }` |
| input      |          | `{ detail: { value }` |
| caret      |          | `{ detail: { column, row }}` |

## CSS Variables

See: `pg-textarea`.
