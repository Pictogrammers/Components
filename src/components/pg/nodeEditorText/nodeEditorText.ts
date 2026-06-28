import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorText.html';
import style from './nodeEditorText.css';

@Component({
  selector: 'pg-node-editor-text',
  style,
  template,
})
export default class PgNodeEditorText extends HTMLElement {

  static type = 'Text';

  @Prop() label: string = '';
  @Prop() value: string = '';
  @Prop() name: string = '';

  @Part() $label: HTMLLabelElement;
  @Part() $input: HTMLInputElement;

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
          value: this.$input.value,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$input.value = this.value;
    }
  }

  get height() {
    return 2;
  }
}
