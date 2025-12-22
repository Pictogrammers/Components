import { Component, Prop, Part } from '@pictogrammers/element';

import template from './json.html';
import style from './json.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-json-array',
  style,
  template,
})
export default class PgJsonArray extends HTMLElement {
  @Prop() items: any[] = [];

  @Part() $items: HTMLElement;

  render(changes) {

  }
}
