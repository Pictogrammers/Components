import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './menuItem.html';
import style from './menuItem.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu-item',
  style,
  template
})
export default class PgMenuItem extends HTMLElement {
  static delegatesFocus = true;

  @Prop() index: number;
  @Prop() label: string = '';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;

  @Part() $label: HTMLButtonElement;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.disabled) {
      this.$label.disabled = this.disabled;
    }
    if (changes.checked) {
      this.$label.classList.toggle('checked', this.checked);
    }
  }

  connectedCallback() {
    this.$label.addEventListener('click', () => {
      this.checked = true;
      this.dispatchEvent(new CustomEvent('select', {
        detail: { index: this.index }
      }));
    });
    this.$label.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          this.dispatchEvent(new CustomEvent('down', {
            detail: { index: this.index }
          }));
          e.preventDefault();
          break;
        case 'ArrowUp':
          this.dispatchEvent(new CustomEvent('up', {
            detail: { index: this.index }
          }));
          e.preventDefault();
          break;
      }
    });
  }

  focus() {
    this.$label.focus();
  }

  getHeight(): number {
    return this.$label.getBoundingClientRect().height;
  }

}