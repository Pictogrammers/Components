import { Component, Prop, Part } from '@pictogrammers/element';

import template from './modalPrompt.html';
import style from './modalPrompt.css';

import PgOverlay from '../overlay/overlay';
import PgButton from '../button/button';
import PgInputText from '../inputText/inputText';
import PgModalHeader from '../modalHeader/modalHeader';

import '../modalBody/modalBody';
import '../modalFooter/modalFooter';

@Component({
  selector: 'pg-modal-prompt',
  template,
  style
})
export default class PgModalPrompt extends PgOverlay {
  @Prop() header: string = 'Please provide a value';
  @Prop() message: string = '';
  @Prop() value: string = '';
  @Prop() placeholder: string = '';
  @Prop() cancel: string = 'Cancel';
  @Prop() okay: string = 'Okay';

  @Part() $header: PgModalHeader;
  @Part() $headerText: HTMLHeadingElement;
  @Part() $message: HTMLParagraphElement;
  @Part() $input: PgInputText;
  @Part() $okay: PgButton;
  @Part() $cancel: PgButton;

  #cacheKeydownHandler: any;

  connectedCallback() {
    this.$okay.addEventListener('click', this.#handleOkay.bind(this));
    this.$cancel.addEventListener('click', this.#handleCancel.bind(this));
    this.$input.addEventListener('keydown', this.#handleInputKeyDown.bind(this));
    this.#cacheKeydownHandler ??= this.#handleKeyDown.bind(this);
    document.addEventListener('keydown', this.#cacheKeydownHandler);
    this.$input.focus();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#cacheKeydownHandler);
  }

  #handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.close(null);
    }
  }

  #handleInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#handleOkay();
    }
  }

  #handleOkay() {
    this.close(this.$input.value);
  }

  #handleCancel() {
    this.close(null);
  }

  render(changes) {
    if (changes.header) {
      this.$headerText.textContent = this.header;
    }
    if (changes.message) {
      this.$message.textContent = this.message;
    }
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.placeholder) {
      this.$input.placeholder = this.placeholder;
    }
    if (changes.okay) {
      this.$okay.textContent = this.okay;
    }
    if (changes.cancel) {
      this.$cancel.textContent = this.cancel;
    }
  }
}
