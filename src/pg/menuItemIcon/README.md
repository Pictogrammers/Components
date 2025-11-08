# `<pg-menu>`

The `PgMenuItemIcon` is the `PgMenuItem` with icon support. The `pg-menu` can use both in the same list, but this component has the overhead of includig `PgIcon`.

## Usage

```typescript
import '@pictogrammers/components/pgMenuItemIcon.js';
```

```html
<pg-menu-item></pg-menu-item>
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| `label`    |          | Item label. |
| `icon`     |          | Item icon. |
| `checked`  |          | Item checked. |
| `disabled` |          | Item disabled. |

## Events

```typescript
this.$item.addEventListener('select', (e: any) => {
  const { index } = e.detail;
});
```