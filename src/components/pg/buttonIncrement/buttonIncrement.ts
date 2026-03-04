import { Component, normalizeInt, Prop } from '@pictogrammers/element';

import template from './buttonIncrement.html';
import style from './buttonIncrement.css';
import PgButton from '../button/button';

var timeout, interval;

function clearTimers() {
  clearTimeout(timeout);
  clearInterval(interval);
}

@Component({
  selector: 'pg-button-increment',
  style,
  template
})
export default class PgButtonIncrement extends PgButton {
  @Prop(normalizeInt) incrementDelay = 300;
  @Prop(normalizeInt) incrementStepDelay = 100;

  connectedCallback() {
    super.connectedCallback();
    this.$button.addEventListener('pointerdown', () => {
      const targetId = this.dataset.target;

      this.dispatchEvent(new CustomEvent('increment'));

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          this.dispatchEvent(new CustomEvent('increment'));
        }, this.incrementStepDelay);
      }, this.incrementDelay);
      const pointerLeave = () => {
        this.dispatchEvent(new CustomEvent('finish'));
        clearTimers();
        this.$button.removeEventListener('pointerleave', pointerLeave);
      };
      this.$button.addEventListener('pointerleave', pointerLeave);
    });
    this.$button.addEventListener('pointerup', () => {
      this.dispatchEvent(new CustomEvent('finish'));
      clearTimers();
    });
  }
}
