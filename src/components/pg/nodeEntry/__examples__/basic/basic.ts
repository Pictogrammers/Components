import { Component, Part } from '@pictogrammers/element';
import PgNodeEntry from '../../nodeEntry';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-entry-basic',
  template,
})
export default class XPgNodeBasic extends HTMLElement {

  @Part() $node: PgNodeEntry;

  connectedCallback() {
  }
}
