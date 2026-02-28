# `<pg-button-increment>`

The `pg-button-increment` is the `pg-button` component with an `increment` event for holding down.

```typescript
import '@pictogrammers/components/pg/buttonIncrement';
import PgButtonIncrement from '@pictogrammers/components/pg/buttonIncrement';
```

## Usage

```typescript
this.$button.incrementDelay = 300; // default
this.$button.incrementStepDelay = 100; // default
this.$button.addEventListener('increment', () => {
  // called on initial click and after every 50ms
});
```
