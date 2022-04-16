# `<pg-grid>`

The `pg-grid` component allows a standard way to render a configurable grid of icons.

- Performance
  - Two events are used to track all interactions
    - `mousemove` tracks mouse within the grid
    - `mouseleave` tracks mouse leaving grid
    - When icons are added or removed this means no dom events are binded
  - Virtual icon grid
    - Grid height is calculated based on icons present and dynamic container width
    - Debounced `300` for resize of grid
- Size
  - `pg-scroll` is the only dependency
    - Grid tests can handle grid specific logic
    - Complex viewport and overflow container logic is centralized
  - Tooltips and other interacts are handled via events
    - Allows more customization in other use cases

> Note: Context menus and tooltips can be triggered with events described below. These are outside of the component so they can be rendered elsewhere in the DOM.

```typescript
import '@pictogrammers/components/pgGrid';
import PgGrid from '@pictogrammers/components/pgGrid';
```

```html
<pg-grid></pg-grid>
```

## Attributes

| Attributes | Tested   | Description | Default |
| ---------- | -------- | ----------- | ------ |
| icons      |          | Set icon data | `[]` |
| size       |          | Set icon size | `24` |
| padding    |          | Set icon padding | `8` |
| gap        |          | Set icon gap | `4` |
| width      |          | Set grid width | `'auto'` |
| height     |          | Set grid height | `'auto'` |

### `icons`

The minimal data set must contain the `id`, `name` and `data` field.

```json
[{
  "id": "uuid",
  "name": "account",
  "data": "..."
}]
```

## Events

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| select     |          | Fired on icon selections |
| openmenu   |          | Right click on icon |
| closemenu  |          | Right click on icon |
| entericon  |          | Keyboard / Mouse on icon |
| leaveicon  |          | Keyboard / Mouse off icon |

### All Events

The `x` and `y` properties are the calculated `top` and `left` in pixels relative to the grid. The `width` and `height` include the `padding`.

The `gridX` and `gridY` are relative to the grid container.

The `gap + extra` will give the remaining space between icons. Note: The left of the first icon is always just the `gap`.

```javascript
interface MouseMeta {
  gridX: number,
  gridY: number,
  x: number,
  y: number,
  width: number,
  height: number,
  column: number,
  row: number,
  index: number,
  gap: number,
  extra: number
}

e = {
  detail: MouseMeta
}
```

## Accessibility

ToDo...

- Arrow key navigation
- Should typing filter grid?