# `<pg-split-panes>`

The `pg-split-panes` component lays out slotted `pg-pane` elements with resizable dividers placed between each one. Panes can be nested to build complex layouts by placing a `pg-split-panes` inside a `pg-pane`.

It fills the size of its containing element, so give it an explicit height (or place it in a flex/grid layout) in order for it to be visible.

```typescript
import '@pictogrammers/components/pg/splitPane';
import PgSplitPanes from '@pictogrammers/components/pg/splitPane';
import '@pictogrammers/components/pg/pane';
import PgPane from '@pictogrammers/components/pg/pane';
```

```html
<pg-split-panes direction="horizontal">
  <pg-pane label="Files" default-size="12" min-size="8">
    ...
  </pg-pane>
  <pg-pane label="Editor">
    ...
  </pg-pane>
</pg-split-panes>
```

A divider is rendered before every pane except the first. Its label comes from the `label` attribute of the pane that follows it.

| Attribute  | Description   |
| ---------- | ------------- |
| direction  | `vertical` (default, stacked top to bottom) or `horizontal` (side by side). |

| Slots       | Description |
| ----------- | ----------- |
| default     | One or more `pg-pane` elements. |

| Events     | Description   |
| ---------- | ------------- |
| resize     | Bubbles up from a `pg-pane` whenever its effective size changes. `detail: { size }` |

| CSS Variables              | Default     | Description |
| -------------------------- | ----------- | ----------- |
| `--pg-focus-color`         | `rgba(79, 143, 249, 0.5)` | Divider hover/active color |
| `--pg-split-panes-label-color` | `#453C4F` | Divider label text color |

> See `pg-pane` for the `label`, `minSize`, `defaultSize` and `size` attributes.
