# `PgModalAlert`

The `PgModal` is a base class for creating modals.

```typescript
import '@pictogrammers/components/pgModal';
import PgModal from '@pictogrammers/components/pgModal';
```

```typescript
import { Component, Prop, Part } from '@pictogrammers/element';

import template from './modal.html';
import style from './modal.css';

@Component({
  selector: 'my-modal',
  template,
  style
})
export default class MyModal extends PgModal {
  @Part() $close: HTMLButtonElement;
  connectedCallback() {
    this.$close.addEventListener('click', () => {
      this.close();
    });
  }
}
```
