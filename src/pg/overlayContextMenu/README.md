# Overlay Menu

The `PgOverlayContextMenu` creates an overlay menu above a source element. For standard menu lists use the `PgMenuItem` for the check.

Components that use `PgOverlayContextMenu` include:

- `pg-input-select`

## Usage

```typescript
import PgMenuItem from '@pictogrammers/components/pg/menuItem';

#isOpen: false;
handleSourceClick() {
  if (this.#isOpen) { return; }
  this.#isOpen = true;
  const result = await PgOverlayContextMenu.open({
    source: this.$element,
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
