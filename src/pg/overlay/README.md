# `PgOverlay`

The `PgOverlay` class provides a way to create an element on the body element. Elements that should be attached at the body root should extend `PgOverlay`.


## Example Modal

```typescript
import { Component, Prop } from '@pictogrammers/element';
import PgOverlay from '@pictogrammers/components/pgOverlay';

import template from './modal.html';
import style from './modal.css';

@Component({
  selector: 'pg-modal',
  template,
  style
})
export default class PgModal extends PgOverlay {
  // This will render attached to the body. To close call
  // this.close(result);

  @Prop() foo: string = 'Default';
}
```

While this component can be inlined still it will mostly be opened via the a static open method which will create an instance and attach it to the `<body>` tag.

```typescript
import PgModal from './../modal/modal';

const result = await PgModal.open({
  foo: 'bar'
});
console.log(result);
```