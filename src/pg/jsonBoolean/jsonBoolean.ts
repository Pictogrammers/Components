import { Component, Prop, Part } from '@pictogrammers/element';

import PgOverlaySelectMenu from '../overlaySelectMenu/overlaySelectMenu';

import template from './jsonBoolean.html';
import style from './jsonBoolean.css';

@Component({
  selector: 'pg-json-boolean',
  style,
  template,
})
export default class PgJsonBoolean extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: boolean = false;

  @Part() $key: HTMLDivElement;
  @Part() $value: HTMLButtonElement;

  connectedCallback() {
    this.$value.addEventListener('click', this.#handleClick.bind(this));
    // this.$value.value = e.detail.value;
    // this.dispatchEvent(
    //   new CustomEvent('update', {
    //     detail: {
    //       path: [this.key],
    //       value: e.detail.value,
    //     }
    //   })
    // );
  }

  render(changes) {
    if (changes.key) {
      this.$key.textContent = this.key;
    }
    if (changes.value) {
      this.$value.textContent = this.value ? 'true' : 'false';
    }
  }

  options = [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
  ];

  #menuOpen = false;
  async #handleClick() {
    if (this.#menuOpen) { return; }
    this.#menuOpen = true;
    const result = await PgOverlaySelectMenu.open({
      source: this.$value,
      value: this.options.find(x => x.value === `${this.value}`) ?? 'false',
      items: this.options,
    });
    if (result !== undefined) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: result.value
        }
      }));
      this.$value.textContent = result.label;
      this.value = result.value === 'true';
    }
    this.#menuOpen = false;
  }
}
