import { Component, Prop, Part } from '@pictogrammers/element';
import { uuid } from '../shared/uuid';
import { removeToast } from '../shared/toast';

import template from './toast.html';
import style from './toast.css';

@Component({
  selector: 'pg-toast',
  style,
  template
})
export default class PgToast extends HTMLElement {
  @Prop() loading: boolean = false;
  @Prop() message: string = '';
  @Prop() type: string = 'default';
  @Prop() key: string = uuid();

  @Part() $button: HTMLButtonElement;
  @Part() $loadingIcon: SVGElement;
  @Part() $closeIcon: SVGElement;
  @Part() $message: HTMLSpanElement;
  @Part() $loading: HTMLSpanElement;

  toasts: any[] = [];

  connectedCallback() {
    this.$button.addEventListener('click', () => {
      removeToast(this.key);
    });
  }

  render() {
    this.$message.innerText = this.message;
    this.$loading.classList.toggle('hide', !this.loading);
    this.$button.classList.toggle('error', this.type === 'error');
    this.$button.classList.toggle('warning', this.type === 'warning');
  }
}