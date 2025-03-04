import { Component, Prop, Part } from '@pictogrammers/element';

import template from './treeButtonIcon.html';
import style from './treeButtonIcon.css';
import PgIcon from '../icon/icon';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-tree-button-icon',
  style,
  template
})
export default class PgTreeButtonIcon extends HTMLElement {

  @Prop() index: number;
  @Prop() icon: string = noIcon;

  @Part() $button: HTMLButtonElement;
  @Part() $icon: PgIcon;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this))
  }

  #handleClick(e) {
    this.dispatchEvent(new CustomEvent('action', {
      bubbles: true,
      composed: true,
      detail: {
        index: this.index
      }
    }));
  }

  render(changes) {
    if (changes.icon) {
      this.$icon.path = this.icon;
    }
  }

}
