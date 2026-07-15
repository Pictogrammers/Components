# `PgTableCellNumber`

See `PgTable`. Default cell render for `number` type.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `0`     | Cell number. |
| key        |          | `''`    | Column key. |
| editable   |          | `false` | Allow editing; read only otherwise. |

Dispatches `action` with `{ value: number, event: 'change' }` on commit. The value is `Number(input)`, so unparseable input yields `NaN` — validate before writing back.
