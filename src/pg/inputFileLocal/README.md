# `<pg-input-file-local>`

The `pg-input-file-local` component allows a quick way to read uploaded files for local processing. Such as reading a JSON file or text based file. It can also take in image files.

```typescript
import '@pictogrammers/components/pg/inputLocalFile';
import PgInputFileLocal from '@pictogrammers/components/pg/inputLocalFile';
```

```html
<pg-input-file-local
  acceptsFileType="json,txt">
</pg-input-file-local>
```

## Attributes

| Attributes          | Tested   | Description |
| ------------------- | -------- | ----------- |
| `accepts-file-type` | &#x2705; | Allowed files. |

## Events

| Events     | Detail |
| ---------- | ------ |
| `change`   | `{ value, name }` |

## CSS Variables

For CSS Variables please look at the `pg-button` as all CSS styles are shared.