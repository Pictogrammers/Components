import { Component, Part, Prop } from '@pictogrammers/element';

import template from './app.html';
import style from './app.css';

@Component({
  selector: 'pg-app',
  style,
  template
})
export default class PgApp extends HTMLElement {
  @Part() $logo: HTMLButtonElement;


}