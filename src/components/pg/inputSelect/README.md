# `<pg-input-select>`

The `pg-input-select` component creates an select drop down.

```typescript
import '@pictogrammers/components/pgInputSelect';
import { PgInputSelect } '@pictogrammers/components/pgInputSelect';
```

```html
<pg-input-select></pg-input-select>
```

## Attributes

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| options    |          | `[{ label: 'hello', value: 'world' }]` |
| value      |          | `world` |
| default    |          | Item shown when `value` is empty, e.g. `{ label: 'None', value: '' }` |
| readOnly   |          | Prevents opening the menu and keyboard selection. |

## Events

| Event     | Tested   | Detail |
| --------- | -------- | ----------- |
| change    |          | `{ value: 'world' }` |

The component does not update its own `value` on selection; assign `value` back in the `change` handler to commit it.
