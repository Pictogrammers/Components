# `<pg-menu>`

The `pg-menu` component renders a menu list. Menus can be used inline, but are usually created by a parent component. For example:

- `pg-button-menu` - Button Menu
  - Default item `type` is `PgMenuItem`
- `pg-button-icon-menu` - Button Icon Menu
  - Default item `type` is `PgMenuItem`
- `PgMenuOverlay` Utility overlay for menus.
  - The item `type` is required.

```typescript
import '@pictogrammers/components/pg/menu';
```

```html
<pg-menu part="menu"></pg-menu>
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| `items`    |          | Set items list. Ex: `{ type: PgMenuItem }` |

```typescript
import PgMenuItem from '@pictogrammers/components/pg/menuItem';

// ...
@Part() $menu: PgMenu;

connectedCallback() {
  this.$menu.items = [{
    label: 'Item 1',
    value: 'item1',
    type: PgMenuItem
  }];
}
```

## CSS Variables

| Variable | Default |
| -------- | ------- |
| `--pg-menu-padding` | `0.25rem` |
| `--pg-menu-border-width` | `0` |
| `--pg-menu-background-color` | `transparent` |
| `--pg-menu-box-shadow` | `none` |