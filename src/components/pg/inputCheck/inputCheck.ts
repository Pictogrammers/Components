import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputCheck.html';
import style from './inputCheck.css';

const PATH_BLANK = 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z';
const PATH_CHECKED = 'M19 19L5 19V5H15V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V11H19';

@Component({
  selector: 'pg-input-check',
  style,
  template
})
export default class PgInputCheck extends HTMLElement {
  @Prop() value: string | boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() readOnly: boolean = false;

  @Part() $button: HTMLButtonElement;
  @Part() $path: SVGPathElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    const value = [true, 'true'].includes(this.value);
    this.value = !value;
    this.dispatchEvent(new CustomEvent('change'));
  }

  render(changes) {
    if (changes.value) {
      const value = [true, 'true'].includes(this.value);
      this.$path.setAttribute('d', value ? PATH_CHECKED : PATH_BLANK);
      this.$button.classList.toggle('blank', !value);
      this.$button.classList.toggle('checked', value);
    }
    if (changes.disabled) {
      this.$button.disabled = ['', true, 'true'].includes(this.disabled);
    }
    if (changes.readOnly) {
      this.$button.classList.toggle('readonly', this.readOnly);
    }
  }
}