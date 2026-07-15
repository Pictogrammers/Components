# `PgTableCellText`

See `PgTable`. Default cell render for `string` type.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `''`    | Cell text. |
| key        |          | `''`    | Column key. |
| editable   |          | `false` | Allow editing; read only otherwise. |
| maxWidth   |          | `null`  | Number of pixels or any CSS length string. |

Dispatches `action` with `{ value: string, event: 'input' | 'change' }` while editing.
