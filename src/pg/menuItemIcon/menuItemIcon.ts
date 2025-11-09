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
  @Prop() icon: string = 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z';
  @Prop() label: string = '';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;

  @Part() $icon: PgIcon;
  @Part() $button: HTMLButtonElement;
  @Part() $label: HTMLSpanElement;

  render(changes) {
    if (changes.icon) {
      this.$icon.path = this.icon;
    }
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.disabled) {
      this.$button.disabled = this.disabled;
    }
    if (changes.checked) {
      this.$button.classList.toggle('checked', this.checked);
    }
  }

  connectedCallback() {
    this.$button.addEventListener('click', () => {
      this.checked = true;
      this.dispatchEvent(new CustomEvent('select', {
        detail: { index: this.index }
      }));
    });
    this.$button.addEventListener('keydown', (e: KeyboardEvent) => {
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
    this.$button.focus();
  }

  getHeight(): number {
    return this.$label.getBoundingClientRect().height;
  }

}