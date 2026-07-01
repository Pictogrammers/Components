# Tree

The `pg-tree` is used to render a tree list of items.

- Folder / Item symbols
- Drag and Drop
- Context Menu

## Usage

While setup for a normal file tree this can be used for any folder structure.

```typescript
import PgTree, { SelectedTreeItem } from '@pictogrammers/components/pg/tree';
```

## Item Data Shape

Each item in the `items` array follows this structure:

```typescript
{
  label: string;
  icon: { path: string };
  isFolder: boolean;      // true enables the drop-onto zone and .items CSS class
  expanded?: boolean;     // folders only
  items?: any[];          // child items (folders only)
  actions?: {
    type: typeof PgTreeButtonIcon;
    icon: string;
    enabled: boolean;
    label?: string;       // used as button title / aria-label
  }[];
}
```

## Events

- `select` — one or more items selected / deselected
- `rename` — item label edited inline
- `menu` — right-click context menu requested
- `action` — an action button clicked
- `move` — drag-and-drop reorder completed

```typescript
this.$tree.addEventListener('select', (e: any) => {
  const { items } = e.detail;
  this.selectedItems = items;
});
```

```typescript
this.$tree.addEventListener('rename', (e: any) => {
  const { item, label } = e.detail;
  item.getData().label = label;
});
```

```typescript
this.$tree.addEventListener('menu', (e: any) => {
  const { item, x, y } = e.detail;
  // show context menu at (x, y) for item
});
```

```typescript
this.$tree.addEventListener('action', (e: any) => {
  const { item, actionIndex } = e.detail;
  switch (actionIndex) {
    case 0:
      // toggle visibility
      break;
    case 1:
      item.remove();
      break;
  }
});
```

```typescript
this.$tree.addEventListener('move', (e: any) => {
  const { item, position } = e.detail;
  // position is 'before' | 'after' | 'on'
  this.selectedItems.forEach((selected: SelectedTreeItem) => {
    selected.move(item, position);
  });
});
```

## SelectedTreeItem API

The `item` object passed in event details wraps the raw data with helper methods:

```typescript
item.indexes          // number[] — path to this item in the tree
item.getData()        // returns the raw data object
item.getParentData()  // returns the parent's raw data (or the tree root)
item.remove()         // removes the item and clears selection
item.move(targetItem, position)  // moves to 'before' | 'after' | 'on' the target
```

## Custom Size

Resize the row height via a CSS variable (default `2`, range `1`–`2`):

```css
pg-tree {
  --pg-tree-size: 1.5;
}
```

## CSS Custom Properties

| Property | Description |
|---|---|
| `--pg-tree-background` | Background of the tree container |
| `--pg-tree-item-background` | Default item row background |
| `--pg-tree-item-color` | Icon and text color |
| `--pg-tree-item-font-size` | Label font size |
| `--pg-tree-selected-primary` | Selection indicator / toggle color |
| `--pg-tree-selected-secondary` | Selected row background |
| `--pg-tree-selected-secondary-hover` | Selected row hover background |
