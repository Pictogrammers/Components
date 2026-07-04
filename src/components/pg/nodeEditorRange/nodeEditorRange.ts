import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorRange.html';
import style from './nodeEditorRange.css';

@Component({
  selector: 'pg-node-editor-range',
  style,
  template,
})
export default class PgNodeEditorRange extends HTMLElement {

  static type = 'Range';

  @Prop() label: string = '';
  @Prop() value: number = 0;
  @Prop() name: string = '';
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() step: number = 1;

  @Part() $label: HTMLLabelElement;
  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: Number(this.$input.value),
        }
      }));
    });
    this.$input.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: Number(this.$input.value),
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$input.value = String(this.value);
    }
    if (changes.min) {
      this.$input.min = String(this.min);
    }
    if (changes.max) {
      this.$input.max = String(this.max);
    }
    if (changes.step) {
      this.$input.step = String(this.step);
    }
  }

  get height() {
    return 2;
  }

  focus() {
    this.$input.focus();
  }
}
