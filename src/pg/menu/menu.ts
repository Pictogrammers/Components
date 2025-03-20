import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import PgMenuItem from '../menuItem/menuItem';

import template from './menu.html';
import style from './menu.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu',
  style,
  template
})
export default class PgMenu extends HTMLElement {

  @Prop() items: any[] = [];

  @Part() $items: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return PgMenuItem;
      },
      create: ($item) => {
        $item.addEventListener('select', (e: any) => {
          const { index } = e.detail;
          this.dispatchEvent(new CustomEvent('select', {
            detail: { index }
          }))
        });
      }
    });
  }

}