# `<pg-preview>`

The `pg-table` component allows a standard way to create static tables. While it has features like the datatable it is much more lightweight lacking features like column resize and edit.

- `PgTableHeaderText`
- `PgTableCellText` - default `string` cell type
- `PgTableCellNumber` - default `number` cell type
- `PgTableCellCheck` - default `boolean` cell type
- `PgTableCellButton`
- `PgTableCellButtonIcon`

```typescript
import '@pictogrammers/components/pg/table';
import PgTable, { createTableItem } from '@pictogrammers/components/pg/table';
```

```html
<pg-table part="table"></pg-table>
```

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| columns    |          | []      | Column definition. |
| data       |          | []      | Data |

| CSS Variable        | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-table-font-size`  | `inherit` | Font size |
| `--pg-table-row-background-color` | `#f1f1f1`  | Row background |

## Columns

```typescript
// type: TableHeaderText
this.$table.columns = [{
  label: 'Check All',
  key: 'check',
  hideLabel: true,
  type: TableHeaderCheck,
  editable: true
}, {
  label: 'Name',
  key: 'name'
}, {
  label: 'Age',
  key: 'age'
}, {
  label: 'Favorite',
  key: 'favorite',
  hideLabel: true,
}];
```

Adding `editable: true` to any data types will enable editing and trigger the `action` event (see Events below).

## Data

The `createTableItem` unrolls the `{ key: value }` shorthand to `items: [{ key, value}]` object to support the mutable data.

```typescript
const IconStar = 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z';
const IconStarOutline = 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z';
this.$table.data = [
  createTableItem({
    name: 'Dipper Pines',
    age: 12,
    favorite: {
      type: TableCellButtonIcon,
      icon: IconStar,
    }
  }),
  createTableItem({
    name: 'Mabel Pines',
    age: 12,
    favorite: {
      type: TableCellButtonIcon,
      icon: IconStar,
    }
  })
];
```

## Events

All events dispatched will be the same `action` name. This allows the insert of `index` as it bubbles to the parent `this.$table` element.

```typescript
this.$table.addEventListener('action', (e: any) => {
  const { getColumn, value, key } = e.detail;
  switch(key) {
    case 'selected':
      getColumn(key).value = value;
      break;
    default:
      throw `unhandled action event for key ${key}`;
  }
});
```

From a custom cell component...

```typescript
this.dispatchEvent(new CustomEvent('action', {
  detail {
    other: 'other data',
  },
}))
```
