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

  #focusNext = false;

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
        $item.removable = true;
        $item.addEventListener('change', (e: any) => {
          e.stopPropagation();
          const { index, value } = e.detail;
          this.#inputs[index].value = value;
          this.dispatchEvent(new CustomEvent('change', {
            detail: {
              value: this.#inputs.map(x => x.value),
            },
          }));
        });
        $item.addEventListener('input', (e: any) => {
          e.stopPropagation();
          const { index, value } = e.detail;
          this.#inputs[index].value = value;
          this.dispatchEvent(new CustomEvent('input', {
            detail: {
              value: this.#inputs.map(x => x.value),
            },
          }));
        });
        $item.addEventListener('inputprevious', (e: any) => {
          const { index, selectionIndex } = e.detail;
          const $items = Array.from(this.$inputs.children);
          if ($items.length > 1) {
            if (index === 0) {
              ($items[$items.length - 1] as any).selectionStart = selectionIndex;
              ($items[$items.length - 1] as any).selectionEnd = selectionIndex;
              ($items[$items.length - 1] as any).focus();
            } else {
              ($items[index - 1] as any).selectionStart = selectionIndex;
              ($items[index - 1] as any).selectionEnd = selectionIndex;
              ($items[index - 1] as any).focus();
            }
          }
        });
        $item.addEventListener('inputnext', (e: any) => {
          const { index, selectionIndex } = e.detail;
          const $items = Array.from(this.$inputs.children);
          if ($items.length > 1) {
            if (index === $items.length - 1) {
              ($items[0] as any).selectionStart = selectionIndex;
              ($items[0] as any).selectionEnd = selectionIndex;
              ($items[0] as any).focus();
            } else {
              ($items[index + 1] as any).selectionStart = selectionIndex;
              ($items[index + 1] as any).selectionEnd = selectionIndex;
              ($items[index + 1] as any).focus();
            }
          }
        });
        $item.addEventListener('enter', (e: any) => {
          const { index } = e.detail;
          const emptyItem = this.#inputs.findIndex(x => x.value === '');
          if (emptyItem !== -1) {
            (this.$inputs.children[emptyItem] as any).focus();
            return;
          }
          this.#focusNext = true;
          this.#inputs.splice(index + 1, 0, {
            key: uuid(),
            value: '',
          });
          // Emit updated array
          this.dispatchEvent(new CustomEvent('change', {
            detail: {
              value: this.#inputs.map(x => x.value),
            },
          }));
        });
        $item.addEventListener('remove', (e: any) => {
          const { index } = e.detail;
          if (this.#inputs.length > 1) {
            this.#inputs.splice(index, 1);
            // Emit updated array
            this.dispatchEvent(new CustomEvent('change', {
              detail: {
                value: this.#inputs.map(x => x.value),
              },
            }));
          }
        });
      },
      connect: ($item) => {
        if (this.#focusNext) {
          $item.focus();
          this.#focusNext = false;
        }
      },
    });

    this.$add.addEventListener('click', () => {
      this.#focusNext = true;
      this.#inputs.push({
        key: uuid(),
        value: '',
      });
      // Emit updated array (#inputs is the live list; this.value is only the
      // initial prop and goes stale after the first edit)
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.#inputs.map(x => x.value),
        },
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }

  get height() {
    return this.#inputs.length + 1;
  }

  focus() {
    const first = this.$inputs.firstElementChild as PgNodeInputText;
    first?.focus();
  }
}
