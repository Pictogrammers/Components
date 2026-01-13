# `<pg-button-group>`

The `pg-button-group` wraps the `pg-button` component.

```typescript
import '@pictogrammers/components/pg/buttonGroup';
import PgButtonGroup from '@pictogrammers/components/pg/buttonGroup';
```

```html
<pg-button-group>
  <pg-button active>Hello</pg-button>
  <pg-button>World</pg-button>
</pg-button-group>
```

### Slots

Special styling is applied for `pg-button`.

```html
<pg-button-group>
  <pg-button>
    <pg-icon path="M...Z"></pg-icon>
    With Icons
  </pg-button>
</pg-button-group>
```