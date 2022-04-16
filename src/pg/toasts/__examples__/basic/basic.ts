import { Component, Part, Prop } from '@pictogrammers/element';

import template from './basic.html';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Component({
  selector: 'x-pg-toasts-basic',
  template
})
export default class XPgToastsBasic extends HTMLElement {

  @Part() $toastInfo: HTMLButtonElement;
  @Part() $toastWarning: HTMLButtonElement;
  @Part() $toastError: HTMLButtonElement;
  @Part() $toastLoading: HTMLButtonElement;
  @Part() $toastRemove: HTMLButtonElement;

  connectedCallback() {
    this.$toastInfo.addEventListener('click', this.handleInfo.bind(this));
    this.$toastWarning.addEventListener('click', this.handleWarning.bind(this));
    this.$toastError.addEventListener('click', this.handleError.bind(this));
    this.$toastLoading.addEventListener('click', this.handleLoading.bind(this));
    this.$toastRemove.addEventListener('click', this.handleRemove.bind(this));
  }

  handleInfo() {
    document.body.dispatchEvent(new CustomEvent('pgtoastadd', {
      detail: {
        type: 'info',
        message: 'Hello World! With really long content that wraps rows.',
        key: uuid()
      }
    }));
  }

  handleWarning() {
    document.body.dispatchEvent(new CustomEvent('pgtoastadd', {
      detail: {
        type: 'warning',
        message: 'Hello World! Warning',
        key: uuid()
      }
    }));
  }

  handleError() {
    document.body.dispatchEvent(new CustomEvent('pgtoastadd', {
      detail: {
        type: 'error',
        message: 'Hello World! Error',
        key: uuid()
      }
    }));
  }

  handleLoading() {
    this.key = uuid();
    document.body.dispatchEvent(new CustomEvent('pgtoastadd', {
      detail: {
        type: 'info',
        message: 'Loading...',
        loading: true,
        key: this.key
      }
    }));
  }

  key: string = '';
  handleRemove() {
    if (this.key) {
      document.body.dispatchEvent(new CustomEvent('pgtoastremove', {
        detail: {
          key: this.key
        }
      }));
      this.key = '';
    }
  }

}