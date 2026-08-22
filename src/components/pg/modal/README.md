# `PgModalAlert`

The `PgModal` is a base class for creating modals.

```typescript
import '@pictogrammers/components/pgModal';
import PgModal from '@pictogrammers/components/pgModal';
```

```typescript
import { Component, Prop, Part } from '@pictogrammers/element';

import '@pictogrammers/components/pg/modalHeader';
import '@pictogrammers/components/pg/modalBody';
import '@pictogrammers/components/pg/modalFooter';

@Component({
  selector: 'my-modal',
  template: `
    <pg-modal-header>My Modal</pg-modal-header>
    <pg-modal-body>Hello!</pg-modal-body>
    <pg-modal-footer>
      <button part="close">Close</button>
    </pg-modal-footer>
  `
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

Use `pg-modal-header`, `pg-modal-body`, and `pg-modal-footer` as purely presentational sections for the header, body, and footer of a modal.
