# `PgTableCellFileLocal`

See `PgTable`. Local file upload cell; use via an explicit `type` in the data item. Reads the selected file locally (no upload to a server) and dispatches its contents.

| Attributes      | Tested   | Default | Description |
| --------------- | -------- | ------- | ----------- |
| value           |          | `null`  | Optional state managed by the consumer (not rendered); e.g. store the file name so it appears in `getCSV()`. |
| key             |          | `''`    | Column key. |
| acceptsFileType |          | `''`    | Allowed file extensions, e.g. `json,txt`; usually set via the column definition. |

Dispatches `action` with `{ value: string, name: string, event: 'change' }` when a file is read — `value` is the file text and `name` the file name.
