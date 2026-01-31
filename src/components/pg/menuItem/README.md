# `<pg-menu>`

The `PgMenuItem` is used with the `pg-menu` as a `type: PgMenuItem`.

For icon support use `PgMenuItemIcon`.

## Usage

```typescript
import '@pictogrammers/components/pgMenuItem.js';
```

```typescript
this.$items = [{
  type: PgMenuItem,
  label: 'Item 1',
  items: [{
    type: PgMenuItem,
    label: 'Sub Item 1',
  }]
}];
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| `label`    |          | Item label. |
| `checked`  |          | Item checked. |
| `disabled` |          | Item disabled. |

| CSS Variable        | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-menu-item-border-radius`  | `0.25rem` | Radius       |

## Events

```typescript
this.$item.addEventListener('select', (e: any) => {
  // user clicks 'Sub Item 1'
  const { indexes, item } = e.detail;
  // indexes = [0, 0]
  console.log(item.label);
});
```