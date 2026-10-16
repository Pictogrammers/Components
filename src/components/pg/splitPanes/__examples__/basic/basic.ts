import { Component, Part } from '@pictogrammers/element';
import PgSplitPanes from '../../splitPanes';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-split-panes-basic',
  template,
  style
})
export default class XPgSplitPaneBasic extends HTMLElement {

  @Part() $splitPanes: PgSplitPanes;
  @Part() $value: HTMLElement;

  connectedCallback() {
    this.$splitPanes.addEventListener('resize', this.#handleResize.bind(this));
  }

  #handleResize(e: any) {
    const { size } = e.detail;
    this.$value.textContent = `${size.toFixed(2)}rem`;
  }
}
