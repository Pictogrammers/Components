# Overlay Menu

The `PgOverlayMenu` creates a menu.

```typescript
if (this.#isOpen) { return; }
this.#isOpen = true;
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
console.log(result);
```