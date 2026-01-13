# `<pg-input-check-list>`

The `pg-input-check-list` component is a list of checkboxes.

```typescript
import '@pictogrammers/components/pg/inputCheck';
import PgInputCheck from '@pictogrammers/components/pg/inputCheck';
```

```html
<pg-input-check-list></pg-input-check-list>
```

## Attributes

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| value      | &#x2705; | Array of checked values. |
| options    | &#x2705; | Array of items. |

Each option object must have a `value`. Optionally a `label` and `disabled`.

## Events

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| change     | &#x2705; | Any change in the list checks. |

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-input-check-blank-color`  | `#453C4F` | Color       |
| `--pg-input-check-chcked-color`  | `#453C4F`  | Color       |
| `--pg-icon-size` | `1.5rem`  | Width / Height      |