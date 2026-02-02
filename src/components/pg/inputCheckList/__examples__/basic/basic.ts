import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputCheckList from '../../inputCheckList';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-check-list-basic',
  template
})
export default class XPgInputCheckListBasic extends HTMLElement {

  @Part() $input: PgInputCheckList;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
      this.$input.value.push('uuid1', 'uuid3');
      this.$input.options.push(
        { value: 'uuid1', label: 'Item 1' },
        { value: 'uuid2', label: 'Item 2' },
        { value: 'uuid3', label: 'Item 3', disabled: true },
        { value: 'uuid4', label: 'Item 4' }
      );
      this.$value.textContent = this.$input.value.join(',');
      this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    const { value } = e.detail;
    this.$value.textContent = value.join(',');
  }
}