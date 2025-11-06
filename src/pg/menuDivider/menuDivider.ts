import { Component, Prop } from '@pictogrammers/element';

import template from './menuDivider.html';
import style from './menuDivider.css';

@Component({
  selector: 'pg-menu-divider',
  style,
  template
})
export default class PgMenuDivider extends HTMLElement {
  @Prop() focusable = false;
}