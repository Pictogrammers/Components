import { Component, Prop, Part, node, forEach } from '@pictogrammers/element';

import template from './tab.html';
// import style from './tabs.css';

@Component({
  selector: 'pg-partial-tab',
  template
})
export default class PgPartialTab extends HTMLElement {

  @Prop() label: string = '';

  @Part() $tab: HTMLLIElement;
  @Part() $button: HTMLButtonElement;

  render(changes) {
    if (changes.label) {
      this.$button.textContent = this.label;
    }
  }

}