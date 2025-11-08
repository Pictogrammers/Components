# `<pg-menu>`

The `pg-menu-item` is usually rendered as a child of the `pg-menu` as a `type: PgMenuItem`.

## Usage

```typescript
import '@pictogrammers/components/pgMenuItem.js';
```

```html
<pg-menu-item></pg-menu-item>
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