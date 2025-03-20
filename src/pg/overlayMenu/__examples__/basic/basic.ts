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

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
  }

  async #handleClick() {
    const result = await PgOverlayMenu.open({
      source: this.$button,
      items: [{
        label: 'Item 1',
        value: 'item1'
      },
      {
        label: 'Item 2',
        value: 'item2'
      }]
    });
    console.log(result);
  }
}