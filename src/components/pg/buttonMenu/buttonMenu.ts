import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItem from '../menuItem/menuItem';
import PgIcon from '../icon/icon';
import PgOverlayMenu from '../overlayMenu/overlayMenu';

import '../button/button';
import PgButton from '../button/button';

import template from './buttonMenu.html';
import style from './buttonMenu.css';

const IconExpand = 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z';
const IconCollapse = 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z';

@Component({
  selector: 'pg-button-menu',
  style,
  template
})
export default class PgButtonMenu extends HTMLElement {
  @Prop() items: any[] = [];
  @Prop() value: any = null;
  @Prop() label: string = '';
  @Prop() default: any = null;

  @Part() $button: PgButton;
  @Part() $icon: PgIcon;
  @Part() $label: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
  }

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }

  #menuOpen = false;
  async #handleClick() {
    this.#menuOpen = !this.#menuOpen;
    this.$icon.path = this.#menuOpen ? IconCollapse : IconExpand;
    if (!this.#menuOpen) { return; }
    // Create Menu
    const result = await PgOverlayMenu.open({
      source: this,
      default: this.default ?? this.items[0],
      value: this.items.find(x => x.value === this.value) ?? null,
      items: this.items
    });
    this.$icon.path = IconExpand;
    if (result !== undefined) {
      const { indexes, item } = result;
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          indexes,
          item,
          value: item.value
        }
      }));
    }
    this.#menuOpen = false;
  }
}