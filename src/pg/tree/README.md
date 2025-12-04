# Tree

The `pg-tree` is used to render a tree list of items.

- Folder / Item symbols
- Drag and Drop
- Context Menu

## Usage

While setup for a normal file tree this can be used for any folder structure.

```typescript
import '@pictogrammers/components/pg/tree';
import '@pictogrammers/components/pg/treeItem';
import '@pictogrammers/components/pg/treeButtonIcon';
import PgTree, { SelectedTreeItem } from '@pictogrammers/components/pg/tree';
```

## Events

- select
- rename
- menu
- action
- drop

```typescript
this.$tree.addEventListener('select', (e: any) => {
  const { items } = e.detail;
  // items is a
  this.selectedItems = items;
});
```

```typescript
this.$tree.addEventListener('rename', (e: any) => {
  const { item, label } = e.detail;
  const itemData = item.getData();
  itemData.label = label;
});
```

```typescript
this.$tree.addEventListener('menu', (e: any) => {
  // menu item click
});
```

```typescript
this.$tree.addEventListener('action', (e: any) => {
  const { item, actionIndex } = e.detail;
  // item is a wrapper with all utility functions
  switch(actionIndex) {
    case 0:
      // select in view
      break;
    case 1:
      item.remove();
      break;
  }
});
```

```typescript
this.$tree.addEventListener('drop', (e: any) => {
  // cancelable
  const { items, dropIndexes } = e.detail;
  // If folder ignore items under folder

  items.forEach(() => {
    item.move(dropIndexes);
  })
});
```

## Custom Size

Resize from the default 32px height all the way down to 24px tall via a CSS Variable.

```css
--pg-icon-width: 1rem;
--pg-icon-height: 1rem;
```
