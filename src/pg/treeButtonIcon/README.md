# Tree Button Icon

Tree button icons are used in the `pg-tree` component for actions. See `pg-tree` for documentation.

## Usage

```typescript
this.$tree.items = [{
  icon: {
    path: IconFile
  },
  label,
  actions: [{
    type: PgTreeButtonIcon,
    label: 'Select in View',
    icon:  IconSelect,
    enabled: true
  },
  {
    type: PgTreeButtonIcon,
    label: 'Delete',
    icon: IconTrash,
    enabled: true
  }]
}];

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