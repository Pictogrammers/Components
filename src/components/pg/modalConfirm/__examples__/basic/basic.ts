import { Component, Part, Prop } from '@pictogrammers/element';
import PgModalConfirm from '../../modalConfirm';

import template from './basic.html';

@Component({
  selector: 'x-pg-modal-confirm-basic',
  template
})
export default class XPgModalConfirmBasic extends HTMLElement {

  @Part() $button: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  async handleClick() {
    const result = await PgModalConfirm.open({
      header: 'Delete Item',
      message: 'Are you sure you want to delete the item?',
      okay: 'Delete',
      cancel: 'Keep Item',
    });
    this.$result.textContent = `${result}`;
  }

}