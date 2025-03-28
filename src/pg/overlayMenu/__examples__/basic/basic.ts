import { Component, Part, Prop } from '@pictogrammers/element';
import PgOverlayMenu from '../../overlayMenu';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-overlay-menu-basic',
  template,
  style
})
export default class XPgOverlayMenuBasic extends HTMLElement {
  @Part() $button: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;
  @Part() $input: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
  }

  #value = null;

  #menuOpen = false;
  async #handleClick() {
    if (this.#menuOpen) { return; }
    const items = [{
      label: 'Item 1',
      value: 'item1'
    },
    {
      label: 'Item 2',
      value: 'item2'
    }];
    this.#menuOpen = true;
    const result = await PgOverlayMenu.open({
      source: this.$button,
      value: this.#value,
      items,
      oninput: (value) => {
        this.$input.textContent = value;
      }
    });
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = result;
    this.#menuOpen = false;
  }
}