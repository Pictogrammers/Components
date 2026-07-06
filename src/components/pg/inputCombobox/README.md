# `<pg-input-combobox>`

The `pg-input-combobox` component creates a text input that filters a dropdown list of options.

```typescript
import '@pictogrammers/components/pgInputCombobox';
import { PgInputCombobox } from '@pictogrammers/components/pgInputCombobox';
```

```html
<pg-input-combobox></pg-input-combobox>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| options     |          | `[{ label: 'hello', value: 'world' }]` |
| value       |          | `world` |
| placeholder |          | `Search...` |
| name        |          | `fieldName` |

## Events

| Event     | Tested   | Detail |
| --------- | -------- | ----------- |
| change    |          | `{ value: 'world', label: 'hello' }` |
