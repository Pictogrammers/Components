import { Component, Prop, Part } from '@pictogrammers/element';

import template from './modalAlert.html';
import style from './modalAlert.css';

import PgOverlay from '../overlay/overlay';
import PgButton from '../button/button';
import PgModalHeader from '../modalHeader/modalHeader';

import '../modalBody/modalBody';
import '../modalFooter/modalFooter';

@Component({
  selector: 'pg-modal-alert',
  template,
  style
})
export default class PgModalAlert extends PgOverlay {
  @Prop() header: string = 'Are you sure?';
  @Prop() message: string = 'Are you sure?';

  @Part() $header: PgModalHeader;
  @Part() $headerText: HTMLHeadingElement;
  @Part() $message: HTMLDivElement;
  @Part() $okay: PgButton;

  #cacheKeydownHandler: any;

  connectedCallback() {
    this.$okay.addEventListener('click', this.#handleOkay.bind(this));
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
    this.close();
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