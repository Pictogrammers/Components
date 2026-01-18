# `PgModalAlert`

The `PgModalAlert` creates a alert box above everything.

```typescript
import PgModalAlert from '@pictogrammers/components/pgModalAlert';
```

```typescript
const result = await PgModalAlert.open({
  header: 'Delete Item',
  message: 'Are you sure you want to delete the item?'
});
if (result) {
  console.log('Item has been deleted.');
}
```
