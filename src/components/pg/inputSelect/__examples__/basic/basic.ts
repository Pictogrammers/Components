import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputSelect from '../../inputSelect';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-select-basic',
  template
})
export default class XPgInputSelectBasic extends HTMLElement {

  @Part() $input: PgInputSelect;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.options.push(
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
      { label: 'Option 4', value: 'option4' }
    );
    this.$input.default = { label: 'None', value: '', disabled: true };
    //this.$input.value = this.$input.options[1].value;
    this.$input.addEventListener('change', this.#handleChange.bind(this));
  }

  #handleChange(e) {
    const { value } = e.detail;
    this.$input.value = value;
    this.$value.innerText = `${value}`;
  }
}