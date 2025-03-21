# `<pg-menu>`

The `pg-menu` component renders a menu list. Menus can be used inline, but are usually created by a parent component. For example:

- `button-menu` - Button Menu
- `button-icon-menu` - Button Icon Menu
- `PgMenuOverlay` Utility overlay for menus.

```typescript
import '@pictogrammers/components/pgMenu.js';
```

```html
<pg-menu part="menu"></pg-menu>
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| `items`    |          | Set items list. |

```typescript
@Part() $menu: PgMenu;

connectedCallback() {
  this.$menu.items = [{
    label: 'Item 1',
    value: 'item1'
  }];
}
```