import { Component, Part, Local } from '@pictogrammers/element';

import template from './annoy.html';
import style from './annoy.css';

@Component({
  selector: 'pg-annoy',
  style,
  template
})
export default class PgAnnoy extends HTMLElement {
  @Local('contextMenu') current;

  @Part() $contextMenu: HTMLDivElement;
  @Part() $extension: HTMLDivElement;
  @Part() $react: HTMLDivElement;
  @Part() $upgrade: HTMLDivElement;

  @Part() $close: HTMLButtonElement;
  @Part() $list: HTMLDivElement;

  list = [
    'contextMenu',
    'extension',
    'react',
    'upgrade'
  ];

  connectedCallback() {
    let next = this.list.findIndex(name => name === this.current) + 1;
    if (next >= this.list.length) {
      next = 0;
    }
    this.current = this.list[next];
    this[`$${this.current}`].classList.add('show');
    this.$close.addEventListener('click', () => {
      this.$list.style.display = 'none';
    });

    window.addEventListener('scroll', (event) => {
      var d = document.documentElement;
      var offset = d.scrollTop + window.innerHeight;
      var height = d.offsetHeight;

      this.classList.toggle('footer', offset >= height - (4 * 16));
    });
  }
}