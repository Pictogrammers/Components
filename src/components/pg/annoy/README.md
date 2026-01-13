# `<pg-annoy>`

The `pg-annoy` component is the clippy of the the website. It shows annoying notifications in the corner of the page that the user has to close. This rotates on every page view using `localStorage` to track the previously show item.

```typescript
import '@pictogrammers/components/pgAnnoy';
```

```html
<pg-annoy></pg-annoy>
```

A `localStorage` variable switches between the list of items below.
