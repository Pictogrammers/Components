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
  label: 'Item 1'
}];
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| `label`    |          | Item label. |
| `checked`  |          | Item checked. |
| `disabled` |          | Item disabled. |

## Events

```typescript
this.$item.addEventListener('select', (e: any) => {
  const { index } = e.detail;
});
```