# `PgPopover`

The `PgPopover` class provides a way to create a non-modal element on the body element. Unlike `PgOverlay`, `PgPopover` does not trap focus and `create` returns the created instance directly rather than a Promise.

Elements that should be attached at the body root without blocking interaction (tooltips, dropdowns, context menus) should extend `PgPopover`.

| Method | Description |
| ------ | ----------- |
| `destroy()` | Destroy |
| `hide()` | Hide |
| `show()` | Show |

## Example Tooltip

```typescript
import { Component, Prop } from '@pictogrammers/element';
import PgPopover from '@pictogrammers/components/pgPopover';

import template from './tooltip.html';
import style from './tooltip.css';

@Component({
  selector: 'my-tooltip',
  template,
  style
})
export default class MyTooltip extends PgPopover {
  // This will render attached to the body.
  // To close call this.close();

  @Prop() message: string = '';
}
```

The `create` method creates an instance, attaches it to the `<body>` tag, and returns it synchronously.

```typescript
import MyTooltip from './../tooltip/tooltip';

const tooltip = PgTooltip.create({
  source: this.$trigger,
  message: 'Hello!',
});

// Later, dismiss it:
tooltip.destroy();
```
