import { Component, Part, Prop } from '@pictogrammers/element';
import PgTooltip from '../../tooltip';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-tooltip-basic',
  template,
  style
})
export default class XPgTooltipBasic extends HTMLElement {

  @Part() $tooltip1: PgTooltip;
  @Part() $tooltip2: PgTooltip;
  @Part() $tooltipSource1: PgTooltip;
  @Part() $tooltipSource2: PgTooltip;
  @Part() $tooltipTop: HTMLButtonElement;
  @Part() $tooltipTopStart: HTMLButtonElement;
  @Part() $tooltipTopEnd: HTMLButtonElement;
  @Part() $tooltipRight: HTMLButtonElement;
  @Part() $tooltipRightStart: HTMLButtonElement;
  @Part() $tooltipRightEnd: HTMLButtonElement;
  @Part() $tooltipBottom: HTMLButtonElement;
  @Part() $tooltipBottomStart: HTMLButtonElement;
  @Part() $tooltipBottomEnd: HTMLButtonElement;
  @Part() $tooltipLeft: HTMLButtonElement;
  @Part() $tooltipLeftStart: HTMLButtonElement;
  @Part() $tooltipLeftEnd: HTMLButtonElement;

  connectedCallback() {
    const setPosition = (position) => {
      this.$tooltip1.position = position;
      this.$tooltip2.position = position;
      this.$tooltip1.visible = true;
      this.$tooltip1.rect = this.$tooltipSource1.getBoundingClientRect();
      this.$tooltip1.text = 'Hello World!';
      this.$tooltip2.visible = true;
      this.$tooltip2.rect = this.$tooltipSource2.getBoundingClientRect();
      this.$tooltip2.text = '-';
    }
    this.$tooltipTop.addEventListener('click', () => { setPosition('top'); });
    this.$tooltipTopStart.addEventListener('click', () => { setPosition('top-start'); });
    this.$tooltipTopEnd.addEventListener('click', () => { setPosition('top-end'); });
    this.$tooltipRight.addEventListener('click', () => { setPosition('right'); });
    this.$tooltipRightStart.addEventListener('click', () => { setPosition('right-start'); });
    this.$tooltipRightEnd.addEventListener('click', () => { setPosition('right-end'); });
    this.$tooltipBottom.addEventListener('click', () => { setPosition('bottom'); });
    this.$tooltipBottomStart.addEventListener('click', () => { setPosition('bottom-start'); });
    this.$tooltipBottomEnd.addEventListener('click', () => { setPosition('bottom-end'); });
    this.$tooltipLeft.addEventListener('click', () => { setPosition('left'); });
    this.$tooltipLeftStart.addEventListener('click', () => { setPosition('left-start'); });
    this.$tooltipLeftEnd.addEventListener('click', () => { setPosition('left-end'); });
  }
}