import { Component, Prop, Part } from '@pictogrammers/element';
import { uuid } from '../shared/uuid';

import template from './toast.html';
import style from './toast.css';
import PgOverlay from '../overlay/overlay';

const toasts = [];

@Component({
  selector: 'pg-toast',
  style,
  template
})
export default class PgToast extends PgOverlay {
  @Prop() loading: boolean = false;
  @Prop() message: string = '';
  @Prop() type: string = 'default';
  @Prop() key: string = uuid();

  @Part() $button: HTMLButtonElement;
  @Part() $loadingIcon: SVGElement;
  @Part() $closeIcon: SVGElement;
  @Part() $message: HTMLSpanElement;
  @Part() $loading: HTMLSpanElement;

  static open(props: any = {}): Promise<any> {
    // ToDo: validate props
    super.open(props);
    const key = uuid();
    return Promise.resolve(function (config?: any) {
      const scopedKey = key;
      if (config === undefined) {
        this.toasts.find(t => t.key === scopedKey).remove();
      }
    });
  }

  toasts: any[] = [];

  connectedCallback() {
    // Position toast
    // close toast
    this.$button.addEventListener('click', () => {
      this.remove();
    });
  }

  render() {
    this.$message.textContent = this.message;
    this.$loading.classList.toggle('hide', !this.loading);
    this.$button.classList.toggle('error', this.type === 'error');
    this.$button.classList.toggle('warning', this.type === 'warning');
  }
}