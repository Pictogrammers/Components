import { Component, Part, Prop, Local } from '@pictogrammers/element';

import template from './app.html';
import style from './app.css';

@Component({
  selector: 'pg-app',
  style,
  template
})
export default class PgApp extends HTMLElement {
  @Part() $logo: HTMLButtonElement;
  @Part() $home: HTMLDivElement;

  connectedCallback() {
    this.$logo.addEventListener('click', this.#handleClick.bind(this));
  }

  #handleClick() {
    this.$logo.classList.toggle('selected');
    this.$home.classList.toggle('hide');
  }
}
