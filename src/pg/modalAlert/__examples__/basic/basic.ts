import { Component, Part, Prop } from '@pictogrammers/element';
import PgModalAlert from '../../modalAlert';

import template from './basic.html';

@Component({
  selector: 'x-pg-modal-alert-basic',
  template
})
export default class XPgModalAlertBasic extends HTMLElement {

  @Part() $button: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  async handleClick() {
    const result = await PgModalAlert.open({
      header: 'Delete Item',
      message: 'Are you sure you want to delete the item?'
    });
    this.$result.textContent = `${result}`;
  }

}