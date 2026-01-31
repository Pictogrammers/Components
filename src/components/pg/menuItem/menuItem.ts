import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgOverlaySubMenu from '../overlaySubMenu/overlaySubMenu';

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
  @Prop() items: any[] = [];

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
    if (changes.checked) {
      if (this.checked === true) {
        this.dispatchEvent(new CustomEvent('hasCheck', { bubbles: true }));
      }
    }
    if (changes.items) {
      this.$label.classList.toggle('more', this.items.length > 0);
    }
  }

  connectedCallback() {
    this.$label.addEventListener('click', async () => {
      if (this.items.length > 0) {
        const result = await PgOverlaySubMenu.open({
          source: this.$label,
          x: 0,
          y: 0,
          value: this.items[0],
          items: this.items
        });
        if (result === null) {
          this.focus();
        } else if (result) {
          const { indexes, item } = result;
          this.dispatchEvent(new CustomEvent('select', {
            detail: {
              item: result,
              indexes: [...indexes, this.index],
            }
          }));
        } else {
          this.dispatchEvent(new CustomEvent('close', {
            detail: {
              depth: -1,
            }
          }));
        }
      } else {
        this.dispatchEvent(new CustomEvent('select', {
          detail: {
            indexes: [this.index],
            item: undefined, // determined by parent
          }
        }));
      }
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
        case 'Escape':
          this.dispatchEvent(new CustomEvent('close'));
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