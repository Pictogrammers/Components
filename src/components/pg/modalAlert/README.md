# `PgModalAlert`

The `PgModalAlert` creates a alert box dialog. For options like okay/cancel use `PgModalConfirm`.

```typescript
import PgModalConfirm from '@pictogrammers/components/pg/modalAlert';
```

```typescript
const result = await PgModalAlert.open({
  header: 'Something Went Wrong',
  message: 'Some information to alert about.',
});
// we don't care about result
console.log('Okay was clicked');
```
