import { Component, Prop, Part } from '@pictogrammers/element';

import PgIcon from '../icon/icon';

import template from './menuItemIcon.html';
import style from './menuItemIcon.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu-item-icon',
  style,
  template
})
export default class PgMenuItemIcon extends HTMLElement {
  static delegatesFocus = true;

  @Prop() index: number;
  @Prop() icon: string = '';
  @Prop() label: string = '';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;

  @Part() $icon: PgIcon;
  @Part() $label: HTMLButtonElement;

  render(changes) {
    if (changes.icon) {
      this.$icon.path = this.icon;
    }
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