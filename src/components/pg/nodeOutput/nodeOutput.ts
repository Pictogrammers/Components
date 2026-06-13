import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeOutput.html';
import style from './nodeOutput.css';

@Component({
  selector: 'pg-node-output',
  style,
  template,
})
export default class PgNodeOutput extends HTMLElement {
  @Prop() label: string = '';
  @Prop() value: string = '';
  @Prop() name: string = '';

  @Part() $label: HTMLLabelElement;
  @Part() $input: HTMLInputElement;

  connectedCallback() {

  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }

  get height() {
    return 1;
  }
}
