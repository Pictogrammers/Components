import { Component, Part, Prop } from '@pictogrammers/element';

import template from './annoy.html';
import style from './annoy.css';

@Component({
  selector: 'pg-annoy',
  style,
  template
})
export default class PgAnnoy extends HTMLElement {
  @Part() $close: HTMLButtonElement;

  list = [];

  connectedCallback() {
    /*
    window.addEventListener('scroll', (event) => {
      var d = document.documentElement;
      var offset = d.scrollTop + window.innerHeight;
      var height = d.offsetHeight;

      this.classList.toggle('footer', offset >= height - (4 * 16));
    });
    */
  }
}