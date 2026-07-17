# `<pg-input-pills>`

The `pg-input-pills` component renders an array of removable pills inside a text input style box. Each pill is a `pg-input-pill` with a remove button.

```typescript
import '@pictogrammers/components/pg/inputPills';
import PgInputPills from '@pictogrammers/components/pg/inputPills';
```

```html
<pg-input-pills></pg-input-pills>
```

```typescript
$pills.items.push({
  value: 'item1',
  label: 'Item 1',
});
```

## Attributes

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| name       |          | Unique name in `pg-form` |
| items      |          | Array of `{ value, label }` pills. |

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | Pill removed. `{ detail: { value, label, items } }` |

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-input-pills-border-color` | `#453C4F` | Border color. |
| `--pg-input-pills-gap` | `0.25rem` | Gap between pills. |
| `--pg-input-pills-padding-inline` | `0.5rem` | Padding inline. |
| `--pg-input-pills-padding-inline-start` | `0.5rem` | Padding inline start. |
| `--pg-input-pills-padding-inline-end` | `0.5rem` | Padding inline end. |
| `--pg-input-pills-padding-block` | `0.25rem` | Padding block. |
| `--pg-input-pills-padding-block-start` | `0.25rem` | Padding block start. |
| `--pg-input-pills-padding-block-end` | `0.25rem` | Padding block end. |
