import { Component, Part } from '@pictogrammers/element';
import PgModalPrompt from '../../modalPrompt';

import template from './basic.html';

@Component({
  selector: 'x-pg-modal-prompt-basic',
  template
})
export default class XPgModalPromptBasic extends HTMLElement {

  @Part() $button: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;

  currentValue = 'Hello World!';

  connectedCallback() {
    this.$result.textContent = `${this.currentValue}`;
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  async handleClick() {
    const result = await PgModalPrompt.open({
      header: 'Rename Item',
      message: 'Enter a new name for the item.',
      value: this.currentValue,
      placeholder: 'Name',
    });
    this.currentValue = result;
    this.$result.textContent = `${result}`;
  }

}
