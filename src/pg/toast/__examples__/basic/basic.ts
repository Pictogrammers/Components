import { Component, Part } from '@pictogrammers/element';
import PgToast from '../../toast';

import template from './basic.html';

@Component({
  selector: 'x-pg-toasts-basic',
  template
})
export default class XPgToastsBasic extends HTMLElement {

  @Part() $toastInfo: HTMLButtonElement;
  @Part() $toastWarning: HTMLButtonElement;
  @Part() $toastError: HTMLButtonElement;
  @Part() $toastLoading: HTMLButtonElement;
  @Part() $toastToggle: HTMLButtonElement;

  connectedCallback() {
    this.$toastInfo.addEventListener('click', this.handleInfo.bind(this));
    this.$toastWarning.addEventListener('click', this.handleWarning.bind(this));
    this.$toastError.addEventListener('click', this.handleError.bind(this));
    this.$toastLoading.addEventListener('click', this.handleLoading.bind(this));
    this.$toastToggle.addEventListener('click', this.handleToggle.bind(this));
  }

  handleInfo() {
    PgToast.open({
      type: 'info',
      message: 'Hello World! With really long content that wraps rows.',
    });
  }

  handleWarning() {
    PgToast.open({
      type: 'warning',
      message: 'Hello World! Warning',
    });
  }

  handleError() {
    PgToast.open({
      type: 'error',
      message: 'Hello World! Error',
    });
  }

  async handleLoading() {
    const toast = await PgToast.open({
      type: 'info',
      message: 'Loading...',
      loading: true
    });
    setTimeout(() => {
      toast({
        type: 'success',
        message: 'Saved record.',
        timeout: 5
      });
    }, 3000);
  }

  cacheToast: any;
  async handleToggle() {
    if (!this.cacheToast) {
      this.cacheToast = await PgToast.open({
        type: 'info',
        message: 'Loading...',
        loading: true
      });
    } else {
      this.cacheToast();
      this.cacheToast = null;
    }
  }

}