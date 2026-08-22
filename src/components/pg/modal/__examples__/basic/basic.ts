import { Component, Part, Prop } from '@pictogrammers/element';
import PgModal from '../../modal';

import '../../../modalHeader/modalHeader';
import '../../../modalBody/modalBody';
import '../../../modalFooter/modalFooter';

import template from './basic.html';

@Component({
  selector: 'x-my-modal',
  template: `
    <pg-modal-header>My Modal</pg-modal-header>
    <pg-modal-body>Hello!</pg-modal-body>
    <pg-modal-footer>
      <button part="close">Close</button>
    </pg-modal-footer>
  `
})
export class XMyModal extends PgModal {

  @Prop() header: string = '';
  @Prop() message: string = '';


  @Part() $close: HTMLButtonElement;

  connectedCallback() {
    this.$close.addEventListener('click', () => {
      this.close();
    });
  }
}

@Component({
  selector: 'x-pg-modal-basic',
  template
})
export default class XPgModalBasic extends HTMLElement {

  @Part() $button: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  async handleClick() {
    const result = await XMyModal.open({
      header: 'Delete Item',
      message: 'Are you sure you want to delete the item?',
    });
    this.$result.textContent = `${result}`;
  }

}