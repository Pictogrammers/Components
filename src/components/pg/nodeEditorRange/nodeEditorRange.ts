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
  @Part() $min: HTMLInputElement;
  @Part() $max: HTMLInputElement;

  connectedCallback() {
    this.$min.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: Number(this.$min.value),
        }
      }));
    });
    this.$min.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: Number(this.$min.value),
        }
      }));
    });
    this.$max.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: Number(this.$max.value),
        }
      }));
    });
    this.$max.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: Number(this.$max.value),
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$min.value = String(this.value);
    }
    if (changes.min) {
      this.$min.min = String(this.min);
    }
    if (changes.max) {
      this.$min.max = String(this.max);
    }
    if (changes.step) {
      this.$min.step = String(this.step);
    }
  }

  get height() {
    return 2;
  }

  focus() {
    this.$min.focus();
  }
}
