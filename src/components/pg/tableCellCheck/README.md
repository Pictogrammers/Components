# `PgTableCellCheck`

See `PgTable`. Default cell render for `boolean` type.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `false` | Checked state. |
| key        |          | `''`    | Column key. |
| editable   |          | `false` | Allow toggling; read only otherwise. |

Dispatches `action` with `{ value: boolean }` on toggle.
