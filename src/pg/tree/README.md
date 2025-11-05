# Tree

The `pg-tree` is used to render a tree list of items.

- Folder / Item symbols
- Drag and Drop
- Context Menu

## Usage

While setup for a normal file tree this can be used for any folder structure.

## Events

- select
- rename
- menu
- action
- drop

```typescript
this.$tree.addEventListener('select', (e: any) => {
  const { items } = e.detail;
  this.selectedItems = items;
});
```

```typescript
this.$tree.addEventListener('rename', (e: any) => {
  const { indexes, label } = e.detail;
  const item = this.#getItem(indexes);
  item.label = label;
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