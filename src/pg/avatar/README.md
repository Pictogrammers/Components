# `<pg-avatar>`

The `pg-avatar` component takes a user object and renders an avatar circle.

```typescript
import '@pictogrammers/components/pg/avatar';
import PgAvatar from '@pictogrammers/components/pg/avatar';
```

```html
<pg-avatar user="..."></pg-avatar>
```

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| user       | &#x2705; | User object with `user.base64` defined. |


| CSS Variable        | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-avatar-border-color`  | `#453C4F` | Color       |
| `--pg-avatar-width`  | `3rem`  | Width       |
| `--pg-avatar-height` | `3rem`  | Height      |