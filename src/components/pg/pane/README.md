# `<pg-pane>`

The `pg-pane` component is a scrollable panel used within a `pg-split-panes` parent. Its content scrolls independently when it overflows.

```typescript
import '@pictogrammers/components/pg/pane';
import PgPane from '@pictogrammers/components/pg/pane';
```

> See `pg-split-panes` for examples.

| Attribute    | Description   |
| ------------ | ------------- |
| label        | Optional label shown on the divider rendered before this pane. |
| minSize      | Minimum size in `rem` the pane can be resized to. |
| defaultSize  | Initial size in `rem`. Leave unset (`0`) for the pane to share remaining space. |
| size         | Current size in `rem`. Set to resize the pane; updated automatically while dragging. |

| Events     | Description   |
| ---------- | ------------- |
| resize     | Fired whenever the pane's effective size changes. `detail: { size }` |

> See `pg-split-panes` for CSS Variables.
