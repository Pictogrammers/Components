import { Component, Prop, Part } from '@pictogrammers/element';

import template from './json.html';
import style from './json.css';

@Component({
  selector: 'pg-json-string',
  style,
  template,
})
export default class PgJsonString extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: string = '';

  @Part() $items: HTMLElement;

  render(changes) {

  }
}
