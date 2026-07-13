import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEditorLink.html';
import style from './nodeEditorLink.css';

@Component({
  selector: 'pg-node-editor-link',
  style,
  template,
})
export default class PgNodeEditorLink extends HTMLElement {

  static type = 'Link';

  @Prop() label: string = '';
  @Prop() value: number = 0;
  @Prop() name: string = '';

  @Part() $label: HTMLSpanElement;
  @Part() $link: HTMLButtonElement;
  @Part() $select: HTMLButtonElement;

  connectedCallback() {
    // Pulse the linked node; pg-node proxies this up to pg-nodes.
    this.$link.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('nodepulse', {
        detail: {
          id: this.value,
        }
      }));
    });
    // Ask pg-nodes to enter selection mode; it calls back with the picked id.
    this.$select.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('nodeselection', {
        detail: {
          value: this.value,
          callback: (nodeId: number) => {
            this.value = nodeId;
            this.dispatchEvent(new CustomEvent('change', {
              detail: {
                value: nodeId,
              }
            }));
          },
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$link.textContent = `Node ${this.value}`;
    }
  }

  get height() {
    return 2;
  }

  focus() {
    this.$link.focus();
  }
}
