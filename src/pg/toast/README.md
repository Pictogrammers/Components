# `PgToast`

The `PgToast` utility will open a toast in the top right of the page.

```typescript
import PgToast from '@pictogrammers/components/pgToast';
```

```typescript
PgToast.open({
  type: 'info',
  message: 'Loading...',
  loading: true
});

// On Success
this.handleToast.resolve({
  type: 'success',
  message: 'Saved',
  timeout: 5
});
// On Error
this.handleToast.reject({
  type: 'error',
  message: 'Saved',
  timeout: 5
});
// Close open toast with no config
disconnectedCallback() {
  this.handleToast?.resolve();
}
```

| Prop | default | Description |
| ---- | ------- | ----------- |
| `type` | `info` | `info`, `warning`, `success`, `error` |
| `message` | `''` | Message string. |
| `timeout` | `undefined` | Timeout in seconds |

Toasts can be updated in place without adding to the queue by using the `handleToast` config.

Toasts with a `timeout` will automatically hide and any future `handleToast` executions will add to the queue as a new toast.