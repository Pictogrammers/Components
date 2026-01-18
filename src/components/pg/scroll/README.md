# `<pg-scroll>`

The `pg-scroll` component handles scrolling data in the viewport. This component has 2 use cases.

- Basic: Detecting when a element is in view and reacting differently. Useful to cut down CPU intensive things.
- Advanced: Unlimited lists of data only rendered when in the viewport to cut down DOM elements.

```typescript
import '@pictogrammers/components/pgScroll.js';
```

```html
<pg-scroll></pg-scroll>
```

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| enter      | &#x2705; | Fired when element enters viewport |
| leave      | &#x2705; | Fired when mouse leaves viewport |
| calculate  | &#x2705; | `{ offsetY, viewHeight, height }` |

## Basic

To detect and manage viewport visability listen to the `enter` and `leave` events. For instance JS heavy animations or scrolling a carousel may not make sense while off screen especially if one wants to see the first slide first.

> Note do not use lots of these as they do need to check on very scroll operation.

## Advanced

To create virtual items or scroll containers where only items in the viewport are rendered listen to the `offset` event.

The slotted content will need to dispatch `height` event for the `pg-scroll` to capture.

```typescript
this.$scroll.height = 2000;
```

During resizing/scrolling the `calculate` event will fire rapidly. The container will need to in a performant way render content handling the offset data.

- `height` The height calculated and sent from the child content.
- `viewHeight` This is either equal to `height` or the viewport height.
- `offsetY` Distance from the top. Items in the list should use this to calculate the first item position.