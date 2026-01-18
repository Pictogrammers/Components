import { Component, Part, Prop } from '@pictogrammers/element';
import PgPreview from '../../preview';

import template from './basic.html';

@Component({
  selector: 'x-pg-preview-basic',
  template
})
export default class XPgPreviewBasic extends HTMLElement {

  @Part() $preview: PgPreview;

  connectedCallback() {
    // this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {

  }

}