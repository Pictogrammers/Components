import { Component, normalizeInt, Part, Prop } from '@pictogrammers/element';

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
  @Prop(normalizeInt) incrementStepDelay = 50;

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
    });
    this.$button.addEventListener('pointerup', clearTimers);
    this.$button.addEventListener('pointerleave', clearTimers);
  }

  render(changes) {
    if (changes.incrementStepDelay) {
      console.log(this.incrementStepDelay, '<<<<');
    }
  }
}
