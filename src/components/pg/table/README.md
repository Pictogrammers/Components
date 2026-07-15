# `<pg-table>`

The `pg-table` component allows a standard way to create static tables. While it has features like the datatable it is much more lightweight lacking features like column resize and edit.

- `PgTableColumn` - default column header
- `PgTableCellText` - default `string` cell type
- `PgTableCellNumber` - default `number` cell type
- `PgTableCellCheck` - default `boolean` cell type
- `PgTableCellSelect` - explicit `type` cell; select from column `options`
- `PgTableCellButtonIcon` - explicit `type` cell
- `PgTableCellFileLocal` - explicit `type` cell; local file upload

```typescript
import '@pictogrammers/components/pg/table';
import PgTable, { createTableItem } from '@pictogrammers/components/pg/table';
```

```html
<pg-table part="table"></pg-table>
```

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| columns    |          | []      | Column definition. Must be set before `data`. |
| data       |          | []      | Data |

| Methods    | Description |
| ---------- | ----------- |
| `getCSV()` | Returns the column labels and cell values as CSV text. Values containing `"`, `,`, or newlines are quoted; `null`/`undefined` values become empty fields. |

| CSS Variable        | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-table-border-color` | `#453C4F` | Header bottom border |
| `--pg-table-row-background-color` | unset | Cell background. Odd rows override this with `#f1f1f1` for striping; set it to color even rows. |

## Columns

Columns must be assigned before `data` (rows throw otherwise). Each column supports:

| Field       | Description |
| ----------- | ----------- |
| `label`     | Header text; also used by `getCSV()`. |
| `key`       | Matches the data item key. |
| `hideLabel` | Renders an empty header with `aria-label` instead of text. |
| `editable`  | Passed to the cell in this column; editable cells dispatch `action` events (see Events below). |
| `maxWidth`  | Passed to the cell in this column (`PgTableCellText` only); number of pixels or any CSS length string. |
| `options`   | Passed to the cell in this column (`PgTableCellSelect`); `[{ label, value }]`. |
| `acceptsFileType` | Passed to the cell in this column (`PgTableCellFileLocal`); allowed file extensions, e.g. `json,txt`. |
| `type`      | Optional custom header component; defaults to `PgTableColumn`. |

```typescript
this.$table.columns = [{
  label: 'Select',
  key: 'selected',
  hideLabel: true,
  editable: true
}, {
  label: 'Name',
  key: 'name',
  editable: true,
  maxWidth: '12rem'
}, {
  label: 'Age',
  key: 'age'
}, {
  label: 'Favorite',
  key: 'favorite',
  hideLabel: true,
}];
```

## Data

The `createTableItem` unrolls the `{ key: value }` shorthand to `items: [{ key, value }]` objects to support the mutable data.

- Primitive values pick the default cell by type: `string`, `number`, or `boolean`.
- Object values are spread onto the cell as props and must include a `type` cell component (e.g. `{ type, icon, value }`). A `key` field inside the object is ignored; the shorthand key wins.
- `null`/`undefined` values have no default cell and throw; use an object value with an explicit `type`.

```typescript
const IconStar = 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z';
this.$table.data = [
  createTableItem({
    name: 'Dipper Pines',
    age: 12,
    favorite: {
      type: PgTableCellButtonIcon,
      icon: IconStar,
    }
  }),
  createTableItem({
    name: 'Mabel Pines',
    age: 12,
    favorite: {
      type: PgTableCellButtonIcon,
      icon: IconStar,
    }
  })
];
```

Mutating an item through the `data` proxy (e.g. `getColumn('name').value = 'Stan'`) updates the rendered cell. `data.push(...)`, `data.pop()`, and reassigning `data` reconcile rows in place.

## Events

All events dispatched will be the same `action` name. Rows re-dispatch cell events, adding to the `detail`:

| Detail      | Description |
| ----------- | ----------- |
| `value`     | The new value from the cell, when it has one. `PgTableCellText` and `PgTableCellSelect` dispatch strings, `PgTableCellNumber` numbers (`NaN` when unparseable — validate before writing back), `PgTableCellCheck` booleans, `PgTableCellFileLocal` the file text (with the file `name` alongside). |
| `event`     | `'input'` or `'change'` for text cells; `'change'` for number, select, and file cells. |
| `index`     | Row index. |
| `key`       | Column key of the cell that dispatched. |
| `getColumn(key)` | Returns the item of this row for `key`; assign to it to update the cell. |
| `getRow()`  | Returns all items of this row. |
| `getRows()` | Returns `{ getColumn, index }` for every row; useful for column-wide updates. |

```typescript
this.$table.addEventListener('action', (e: any) => {
  const { getColumn, value, key } = e.detail;
  switch(key) {
    case 'selected':
      getColumn(key).value = value;
      break;
    default:
      throw new Error(`unhandled action event for key ${key}`);
  }
});
```

From a custom cell component...

```typescript
this.dispatchEvent(new CustomEvent('action', {
  detail: {
    other: 'other data',
  },
}));
```
