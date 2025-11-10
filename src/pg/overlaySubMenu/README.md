# Overlay Menu

The `PgOverlaySubMenu` creates an overlay menu above a source element. For standard menu lists use the `PgMenuItem` for the check.

Components that use `PgOverlaySubMenu` include:

- `pg-input-select`

## Usage

```typescript
import PgMenuItem from '@pictogrammers/components/pg/overlaySubMenu';

#isOpen: false;
handleSourceClick(e: MouseEvent) {
  if (this.#isOpen) { return; }
  this.#isOpen = true;
  const result = await PgOverlaySubMenu.open({
    source: this.$element,
    x: e.clientX,
    y: e.clientY,
    items: [{
      label: 'Item 1',
      value: 'item1',
      type: PgMenuItem
    }, {
      label: 'Item 2',
      value: 'item2',
      type: PgMenuItem
    }]
  });
  this.#isOpen = false;
  console.log(result);
}
```
