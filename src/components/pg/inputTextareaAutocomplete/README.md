# `<pg-input-textarea-autocomplete>`

The `pg-input-textarea-autocomplete` component supports everything `pg-input-textarea` and adds tracking for the caret position implementing a list of options.

```typescript
import '@pictogrammers/components/pgInputTextareaAutocomplete';
import { PgInputTextarea } from '@pictogrammers/components/pgInputTextareaAutocomplete';
```

```html
<pg-input-textarea-autocomplete value="50"></pg-input-textarea-autocomplete>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| name        |          | Unique name in `pg-form` |
| value       |          | Field value |
| placeholder |          | Placeholder text |
| tokens      |          | Tokens array |

## Tokens

Tokens will match if the cursor is before, after, or in side of a token regex. The most common is `@` for usernames or `#` for tags.

```typescript
this.$input.tokens = [
  /@([a-zA-Z]+\w+)?/, // @username
  /#([a-zA-Z]+\w+)?/ // #TagName
];
```

## Methods

### `setOptions`

```typescript
this.$input.addEventListener('caret', (e: any) => {
  const { matchIndex, setOptions } = e.detail;
  switch(matchIndex) {
    case 1: // @username
      setOptions([{
        label: 'Dipper',
        value: 'Dipper',
      }]);
      break;
    case 2: // #TagName
      setOptions([{
        label: 'Movie',
        value: 'Movie',
      }]);
      break;
    default:
      setOptions([]);
  }
});
```

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| change     |          | `{ detail: { value }` |
| input      |          | `{ detail: { value }` |
| caret      |          | `{ detail: { column, row }}` |

## CSS Variables

See: `pg-textarea`.
