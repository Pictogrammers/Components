import { Component, Prop } from '@pictogrammers/element';

import template from './menuDivider.html';
import style from './menuDivider.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu-divider',
  style,
  template
})
export default class PgMenuDivider extends HTMLElement {
  @Prop() presentational: boolean = false;
}