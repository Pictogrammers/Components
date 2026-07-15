# `PgTableCellSelect`

See `PgTable`. Select cell; use via an explicit `type` in the data item. `options` are usually defined on the column and forwarded to every cell in it.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `''`    | Selected option value. |
| key        |          | `''`    | Column key. |
| editable   |          | `false` | Allow selecting; read only otherwise. |
| options    |          | `[]`    | `[{ label, value }]`; usually set via the column definition. |

Dispatches `action` with `{ value: string, event: 'change' }` on selection. Write the value back (`getColumn(key).value = e.detail.value`) to commit it to the data item.
