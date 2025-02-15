import { Component, Part, Prop } from '@pictogrammers/element';
import PgTree from '../../tree';

import template from './basic.html';

@Component({
  selector: 'x-pg-tree-basic',
  template
})
export default class XPgTreeBasic extends HTMLElement {
  @Part() $tree: PgTree;

  connectedCallback() {
    this.$tree.items = [{
      key: 1,
      label: 'Item 1',
    },
    {
      key: 2,
      label: 'Item 2'
    }]
  }
}
