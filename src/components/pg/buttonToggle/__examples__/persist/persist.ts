import { Component, Local, Part } from '@pictogrammers/element';
import PgButtonToggle from '../../buttonToggle';

import template from './persist.html';

@Component({
  selector: 'x-pg-button-toggle-persist',
  template
})
export default class XPgButtonTogglePersist extends HTMLElement {

  @Part() $button: PgButtonToggle;
  @Part() $value: HTMLSpanElement;

  // Get shared example store
  @Local('example') #store = new Map<string, any>([
    // example:toggle defaults to false
    ['toggle', false]
  ]);

  connectedCallback() {
    // replace with toggle event??? and throw for click events
    this.$button.addEventListener('click', this.#handleClick.bind(this));
    if (this.#store.get('toggle')) {
      this.$button.active = true;
      this.$value.textContent = 'true';
    }
  }

  #handleClick(e: any) {
    const { active } = e.detail;
    this.$value.textContent = `${active}`;
    this.#store.set('toggle', active);
  }
}