import { Component, Prop, Part } from '@pictogrammers/element';

import template from './modalAlert.html';
import style from './modalAlert.css';

import PgOverlay from '../overlay/overlay';
import PgButton from '../button/button';

@Component({
  selector: 'pg-modal-alert',
  template,
  style
})
export default class PgModalAlert extends PgOverlay {
  @Prop() header: string = 'Are you sure?';
  @Prop() message: string = 'Are you sure?';

  @Part() $header: HTMLDivElement;
  @Part() $headerText: HTMLHeadingElement;
  @Part() $message: HTMLDivElement;
  @Part() $yes: PgButton;
  @Part() $no: PgButton;

  connectedCallback() {
    this.$yes.addEventListener('click', this.handleYes.bind(this));
    this.$no.addEventListener('click', this.handleNo.bind(this));
  }

  handleYes() {
    this.close(true);
  }

  handleNo() {
    this.close(false);
  }

  render(changes) {
    if (changes.header) {
      this.$headerText.innerText = this.header;
    }
    if (changes.message) {
      this.$message.innerText = this.message;
    }
  }
}