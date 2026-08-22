# `PgModalPrompt`

The `PgModalPrompt` creates a dialog with a single text field, an okay button, and a cancel button. For a message only dialog use `PgModalAlert`. For okay/cancel without a field use `PgModalConfirm`.

```typescript
import PgModalPrompt from '@pictogrammers/components/pg/modalPrompt';
```

```typescript
const result = await PgModalPrompt.open({
  header: 'Rename Item',
  message: 'Enter a new name for the item.',
  value: 'Untitled',
  placeholder: 'Name',
});
if (result === null) {
  console.log('Cancelled');
} else {
  console.log('New name:', result);
}
```

## Props

| Props       | Default                    | Description |
| ----------- | --------------------------- | ----------- |
| header      | `'Please provide a value'` | Dialog title |
| message     | `''`                        | Optional message shown above the field |
| value       | `''`                        | Initial value of the field |
| placeholder | `''`                        | Placeholder text for the field |
| okay        | `'Okay'`                    | Okay button label |
| cancel      | `'Cancel'`                  | Cancel button label |

`close()` resolves with the field's value when `Okay` is clicked (or `Enter` is pressed), and `null` when `Cancel` is clicked or `Escape` is pressed.
