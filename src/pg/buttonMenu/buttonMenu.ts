import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItem from '../menuItem/menuItem';
import PgOverlayMenu from '../overlayMenu/overlayMenu';

import '../button/button';
import PgButton from '../button/button';

import template from './buttonMenu.html';
import style from './buttonMenu.css';

const t = [true, 'true', ''];

@Component({
  selector: 'pg-button-menu',
  style,
  template
})
export default class PgButtonMenu extends HTMLElement {
  @Prop() items: any[] = [];
  @Prop() value: any = null;

  @Part() $button: PgButton;
  @Part() $expand: HTMLSlotElement;
  @Part() $collapse: HTMLSlotElement;

  connectedCallback() {
    this.$button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.#handleClick();
      // open menu
      /*this.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            active: this.active
          }
        })
      );*/
    });
  }

  #menuOpen = false;
  async #handleClick() {
    if (this.#menuOpen) { return; }
    const items = this.items.map((item) => {
      return {
        type: PgMenuItem,
        label: item.label,
        value: item.value
      };
    });
    this.#menuOpen = true;
    /*
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = result;
    */
    this.#menuOpen = false;
  }


  render(changes) {
    if (changes.active) {
      this.$expand.style.display = this.$button.active ? 'flex' : 'none';
      this.$collapse.style.display = this.$button.active ? 'none' : 'flex';
    }
  }
}