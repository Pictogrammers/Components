# Overlay Menu

The `PgOverlayMenu` creates a menu.

```typescript
const result = await PgOverlayMenu.open({
  source: this.$element,
  items: [{
    label: 'Item 1',
    value: 'item1'
  }, {
    label: 'Item 2',
    value: 'item2'
  }]
});
```