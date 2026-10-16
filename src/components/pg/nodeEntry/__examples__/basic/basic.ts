import { Component, Part } from '@pictogrammers/element';
import PgNodeEntry from '../../nodeEntry';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-node-entry-basic',
  template,
  style,
})
export default class XPgNodeBasic extends HTMLElement {

  @Part() $node: PgNodeEntry;

  connectedCallback() {
  }
}
