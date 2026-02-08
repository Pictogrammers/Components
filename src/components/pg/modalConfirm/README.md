# `PgModalConfirm`

The `PgModalConfirm` creates a confirm box dialog.

```typescript
import PgModalConfirm from '@pictogrammers/components/pg/modalConfirm';
```

```typescript
const result = await PgModalConfirm.open({
  header: 'Delete Item',
  message: 'Are you sure you want to delete the item?',
  okay: 'Delete',
  cancel: 'Keep Item',
});
if (result) {
  console.log('Item has been deleted.');
}
```
