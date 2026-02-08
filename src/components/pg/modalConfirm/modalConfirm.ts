import { Component, Prop, Part } from '@pictogrammers/element';

import template from './modalConfirm.html';
import style from './modalConfirm.css';

import PgOverlay from '../overlay/overlay';
import PgButton from '../button/button';

@Component({
  selector: 'pg-modal-confirm',
  template,
  style
})
export default class PgModalConfirm extends PgOverlay {
  @Prop() header: string = 'Are you sure?';
  @Prop() message: string = 'Are you sure?';
  @Prop() cancel: string = 'Cancel';
  @Prop() okay: string = 'Okay';

  @Part() $header: HTMLDivElement;
  @Part() $headerText: HTMLHeadingElement;
  @Part() $message: HTMLDivElement;
  @Part() $okay: PgButton;
  @Part() $cancel: PgButton;

  #cacheKeydownHandler: any;

  connectedCallback() {
    this.$okay.addEventListener('click', this.#handleOkay.bind(this));
    this.$cancel.addEventListener('click', this.#handleCancel.bind(this));
    this.#cacheKeydownHandler ??= this.#handleKeyDown.bind(this);
    document.addEventListener('keydown', this.#cacheKeydownHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#cacheKeydownHandler);
  }

  #handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.close(null);
    }
  }

  #handleOkay() {
    this.close(true);
  }

  #handleCancel() {
    this.close(false);
  }

  render(changes) {
    if (changes.header) {
      this.$headerText.textContent = this.header;
    }
    if (changes.message) {
      this.$message.textContent = this.message;
    }
  }
}