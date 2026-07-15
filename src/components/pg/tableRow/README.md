# `PgTableRow`

See `PgTable`. Internal row component; created by `PgTable` from `data` items.

Renders a cell per item, picking the component from the item `type` — a cell component class or a factory `(item) => CellComponent` — or defaulting by `typeof item.value` (`string` → `PgTableCellText`, `number` → `PgTableCellNumber`, `boolean` → `PgTableCellCheck`). Re-dispatches cell `action` events with `index`, `key`, `getColumn`, `getRow`, and `getRows` added to the detail.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| index      |          |         | Row index; managed by `PgTable`. |
| items      |          | `[]`    | Cell items (`{ key, value, ... }`). |
| columns    |          | `[]`    | Column definitions; `editable`, `maxWidth`, `options`, and `acceptsFileType` are forwarded to cells. |
