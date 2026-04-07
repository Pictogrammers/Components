import { Component, Prop, Part } from '@pictogrammers/element';

import template from './popoverAutocompleteItem.html';
import style from './popoverAutocompleteItem.css';

@Component({
  selector: 'pg-popover-autocomplete-item',
  style,
  template
})
export default class PgPopoverAutocompleteItem extends HTMLElement {
  static delegatesFocus = true;

  @Prop() index: number;
  @Prop() label: string = '';
  @Prop() value: any = null;
  @Prop() disabled: boolean = false;

  @Part() $label: HTMLButtonElement;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.disabled) {
      this.$label.disabled = this.disabled;
    }
  }

  connectedCallback() {
    this.$label.addEventListener('mousedown', () => {
      this.dispatchEvent(new CustomEvent('ignore', {
        detail: { index: this.index }
      }));
    });
    this.$label.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('select', {
        detail: { index: this.index, label: this.label, value: this.value }
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
        case 'ArrowLeft':
          this.dispatchEvent(new CustomEvent('left', {
            detail: { index: this.index }
          }));
          e.preventDefault();
          break;
        case 'ArrowRight':
          this.dispatchEvent(new CustomEvent('right', {
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

  click() {
    this.$label.click();
  }

  focus() {
    this.$label.classList.toggle('focus', true);
  }

  blur() {
    this.$label.classList.toggle('focus', false);
  }

  getHeight(): number {
    return this.$label.getBoundingClientRect().height;
  }
}
