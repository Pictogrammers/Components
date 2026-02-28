import { Component, Part } from '@pictogrammers/element';
import PgButtonIncrement from '../../buttonIncrement';

import style from './basic.css';
import template from './basic.html';

@Component({
  selector: 'x-pg-button-increment-basic',
  style,
  template,
})
export default class XPgButtonBasic extends HTMLElement {
  @Part() $button1: PgButtonIncrement;
  @Part() $count1: HTMLSpanElement;
  @Part() $button2: PgButtonIncrement;
  @Part() $count2: HTMLSpanElement;

  connectedCallback() {
    this.$button1.addEventListener('increment', () => {
      const count = parseInt(this.$count1.textContent, 10);
      this.$count1.textContent = `${count + 1}`;
    });
    this.$button2.incrementStepDelay = 50;
    this.$button2.addEventListener('increment', () => {
      const count = parseInt(this.$count2.textContent, 10);
      this.$count2.textContent = `${count + 1}`;
    });
  }
}