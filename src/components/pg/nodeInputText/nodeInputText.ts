import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeInputText.html';
import style from './nodeInputText.css';

@Component({
  selector: 'pg-node-input-text',
  style,
  template,
})
export default class PgNodeInputText extends HTMLElement {

  @Prop() index: number;
  @Prop() value: string = '';
  @Prop() name: string = '';
  @Prop() removable: boolean = false;

  @Part() $input: HTMLInputElement;
  @Part() $remove: HTMLButtonElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.$input.value,
        }
      }));
    });
    this.$input.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          index: this.index,
        }
      }));
    });
    this.$input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        this.dispatchEvent(new CustomEvent('inputprevious', {
          detail: {
            index: this.index,
            selectionStart: this.$input.selectionDirection
              ? this.$input.selectionStart
              : this.$input.selectionEnd,
          }
        }));
      } else if (e.key === 'ArrowDown') {
        this.dispatchEvent(new CustomEvent('inputnext', {
          detail: {
            index: this.index,
            selectionIndex: this.$input.selectionDirection
              ? this.$input.selectionStart
              : this.$input.selectionEnd,
          }
        }));
      }
    });
    this.$remove.addEventListener('click', (e: any) => {
      this.dispatchEvent(new CustomEvent('remove', {
        detail: {
          index: this.index,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.removable) {
      this.$remove.classList.toggle('hide', false);
    }
  }

  focus() {
    this.$input.focus();
  }
}
