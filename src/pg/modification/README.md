# `<pg-modification>`

The `pg-modification` component takes an array of modifications and displays the values.

```typescript
import '@pictogrammers/components/pg/modification';
import PgModification from '@pictogrammers/components/pg/modification';
```

```html
<pg-modification></pg-modification>
```

## Attributes

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ----------- |
| modifications | &#x2705; | Set modification array |
| edit | &#x2705; | `false` | Toggle edit mode |

## Events

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| issue      | &#x2705; | Issue number clicked. |
| edit       | &#x2705; | Edit clicked. |

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-icon-color`  | `#453C4F` | Color       |
| `--pg-icon-width`  | `1.5rem`  | Width       |
| `--pg-icon-height` | `1.5rem`  | Height      |