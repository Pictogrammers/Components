import { Component, Prop, Part } from '@pictogrammers/element';
import { observeToasts } from '../shared/toast';
import PgToast from '../toast/toast';

import template from './toasts.html';
import style from './toasts.css';

@Component({
  selector: 'pg-toasts',
  style,
  template
})
export default class PgToasts extends HTMLElement {
  toasts: any[] = [];

  @Part() $container: HTMLDivElement;

  connectedCallback() {
    observeToasts({
      add: (toast) => {
        this.toasts.push(toast);
        this.render();
      },
      remove: (key) => {
        const index = this.toasts.findIndex(t => t.key === key);
        if (index !== -1) {
          var [toast] = this.toasts.splice(index, 1);
          this.$container.querySelector(`[key="${toast.key}"]`)?.remove();
        }
      }
    });
  }

  render() {
    this.toasts.forEach((toast) => {
      const existing = this.$container.querySelector(`[key="${toast.key}"]`) as PgToast;
      if (existing) {
        existing.message = toast.message;
        existing.loading = toast.loading;
        existing.type = toast.type;
      } else {
        const ele = document.createElement('pg-toast') as PgToast;
        ele.setAttribute('key', toast.key);
        ele.message = toast.message;
        ele.loading = toast.loading;
        ele.type = toast.type;
        this.$container.appendChild(ele);
      }
    });
  }
}