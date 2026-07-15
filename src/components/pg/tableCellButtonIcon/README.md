# `PgTableCellButtonIcon`

See `PgTable`. Icon button cell; use via an explicit `type` in the data item.

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `null`  | Optional state managed by the consumer (not rendered). |
| icon       |          | `''`    | SVG path for the icon. |

Dispatches `action` with an empty detail on click; the row adds `key`, `index`, and the getters. In `getCSV()` output the `value` is used as-is; unset (`null`) values render as empty fields.
