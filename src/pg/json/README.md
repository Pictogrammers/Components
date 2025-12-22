# `<pg-json>`

The `pg-json` component renders json and allows values to be modified. The default data type rendering is below.

- `PgJsonArray`
- `PgJsonObject` - `null` is hardcoded
- `PgJsonString`
- `PgJsonBoolean`
- `PgJsonNumber`

```typescript
import '@pictogrammers/components/pg/json';
import PgIcon from '@pictogrammers/components/pg/json';
```

```html
<pg-json part="json"></pg-json>
```

| Attributes | Tested   | Default | Description |
| ---------- | -------- | ------- | ----------- |
| value      |          | `{}`    | Set json data |
| root       |          | `[]`    | Root of object to render |
| schema     |          | `null`  | JSON Schema |
| expand     |          | `0`     | Default level to expand |
| limit      |          | `10`    | Arrays max items "...{total - max} view more" |
| loadMore   |          | `10`    | Amount to render after clicking load more |

For a root array type set `root: ['items']` and value `{ items: [] }`.

## Event

```typescript
this.$json.value = {
  users: [{
    name: 'Dipper Pines',
    age: 12,
  }]
}; // Array or Object
this.$json.addEventListener('change', (e: any) => {
  const { parent, key, path, value } = e.detail;
  if (value !== parent[key]) {
    parent[key] = value;
  }
});
```

The `path` array gives the deep nesting for the record being modified.

```typescript
// Modifying Dipper's name for instance
path = ['users', 0, 'name'];
```

## Schema

Not required if simply editing existing data. To allow complex editing add a defined schema object.

See https://json-schema.org for tutorials on writing your own schema.
