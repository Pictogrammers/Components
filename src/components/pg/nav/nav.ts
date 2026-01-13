import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nav.html';
import style from './nav.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-nav',
  style,
  template
})
export default class PgNav extends HTMLElement {
  @Prop() nav: string = noIcon;

  @Part() $path: SVGPathElement;

  render() {

  }
}