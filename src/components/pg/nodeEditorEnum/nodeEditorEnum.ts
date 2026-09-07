import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorEnum.html';
import style from './nodeEditorEnum.css';

export interface PgNodeEditorEnumOption {
  value: string;
  label: string;
}

@Component({
  selector: 'pg-node-editor-enum',
  style,
  template,
})
export default class PgNodeEditorEnum extends HTMLElement {

  static type = 'Enum';

  @Prop() label: string = '';
  @Prop() value: string = '';
  @Prop() name: string = '';
  @Prop() options: PgNodeEditorEnumOption[] = [];

  @Part() $label: HTMLSpanElement;
  @Part() $input: HTMLSelectElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.value = this.$input.value;
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
          value: this.$input.value,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.options) {
      this.$input.replaceChildren(...this.options.map((option) => {
        const $option = document.createElement('option');
        $option.value = option.value;
        $option.textContent = option.label;
        return $option;
      }));
      this.$input.value = this.value;
    }
    if (changes.value) {
      this.$input.value = this.value;
    }
  }

  get height() {
    return 2;
  }

  focus() {
    this.$input.focus();
  }
}
