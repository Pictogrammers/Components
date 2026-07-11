import { Component, Part } from '@pictogrammers/element';
import PgNodeResize from '../../nodeResize';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-resize-basic',
  template,
})
export default class XPgNodeResizeBasic extends HTMLElement {

  @Part() $resize: PgNodeResize;

  connectedCallback() {

  }
}
