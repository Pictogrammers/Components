import { Component, Prop, Part } from '@pictogrammers/element';

import template from './header.html';
import style from './header.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-header',
  style,
  template
})
export default class PgHeader extends HTMLElement {
  @Prop() logo: string = noIcon;
  @Prop() name: string = 'Default';

  @Part() $path: SVGPathElement;
  @Part() $name: HTMLSpanElement;

  render(changes) {
    if (changes.logo) {
      this.$path.setAttribute('d', this.logo);
    }
    if (changes.name) {
      this.$name.innerText = this.name;
    }
  }
}