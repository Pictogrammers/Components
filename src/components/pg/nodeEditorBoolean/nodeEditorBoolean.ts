import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorBoolean.html';
import style from './nodeEditorBoolean.css';

@Component({
  selector: 'pg-node-editor-boolean',
  style,
  template,
})
export default class PgNodeEditorBoolean extends HTMLElement {

  static type = 'Boolean';

  @Prop() label: string = '';
  @Prop() value: boolean = false;
  @Prop() name: string = '';

  @Part() $label: HTMLSpanElement;
  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.value = this.$input.checked;
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.$input.checked,
        }
      }));
    });
    this.$input.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: this.$input.checked,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$input.checked = Boolean(this.value);
    }
  }

  get height() {
    return 2;
  }

  focus() {
    this.$input.focus();
  }
}
