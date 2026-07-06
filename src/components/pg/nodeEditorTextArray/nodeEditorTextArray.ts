import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgNodeInputText from '../nodeInputText/nodeInputText';

import template from './nodeEditorTextArray.html';
import style from './nodeEditorTextArray.css';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Component({
  selector: 'pg-node-editor-text-array',
  style,
  template,
})
export default class PgNodeEditorTextArray extends HTMLElement {

  static type = 'TextArray';

  @Prop() label: string = '';
  @Prop() value: string[] = [];
  @Prop() name: string = '';

  @Part() $label: HTMLSpanElement;
  @Part() $inputs: HTMLDivElement;
  @Part() $add: HTMLButtonElement;

  @Prop() #inputs: any[] = [];

  connectedCallback() {
    // Map this.value to list
    this.value.forEach((value) => {
      this.#inputs.push({
        value: value,
        key: uuid(),
      });
    });
    forEach({
      container: this.$inputs,
      items: this.#inputs,
      type: () => PgNodeInputText,
      create: ($item: PgNodeInputText, item: any) => {
        $item.value = item.value;
        $item.addEventListener('change', (e: any) => {
          e.stopPropagation();
          const index = Array.from(this.$inputs.children).indexOf($item);
          const newValue = [...this.value];
          newValue[index] = e.detail.value;
          this.dispatchEvent(new CustomEvent('change', {
            detail: { value: newValue },
          }));
        });
        $item.addEventListener('input', (e: any) => {
          e.stopPropagation();
          const index = Array.from(this.$inputs.children).indexOf($item);
          const newValue = [...this.value];
          newValue[index] = e.detail.value;
          this.dispatchEvent(new CustomEvent('input', {
            detail: { value: newValue },
          }));
        });
      },
    });

    this.$add.addEventListener('click', () => {
      this.#inputs.push({
        key: uuid(),
        value: '',
      });
      // Emit updated array
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: [...this.value, ''] },
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    /*
    if (changes.value) {
      Array.from(this.$inputs.children).forEach(($ele: any, i: number) => {
        $ele.value = this.value[i] ?? '';
      });
    }*/
  }

  get height() {
    return this.#inputs.length * 2 + 2;
  }

  focus() {
    const first = this.$inputs.firstElementChild as PgNodeInputText;
    first?.focus();
  }
}
