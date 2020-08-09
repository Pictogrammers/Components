import { Component, Part, Prop } from '@mdi/element';

import './../button/button';
import MdiButton from './../button/button';

import template from './buttonToggle.html';
import style from './buttonToggle.css';

const t = [true, 'true', ''];

@Component({
  selector: 'mdi-button-toggle',
  style,
  template
})
export default class MdiButtonToggle extends HTMLElement {
  @Prop() active: string | boolean = false;

  @Part() $button: MdiButton;
  @Part() $expand: HTMLSlotElement;
  @Part() $collapse: HTMLSlotElement;

  connectedCallback() {
    this.$button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.active = !t.includes(this.active);
      this.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            active: this.active
          }
        })
      )
    });
  }

  render(changes) {
    if (changes.active) {
      this.$button.active = t.includes(this.active);
      this.$expand.style.display = this.$button.active ? 'initial' : 'none';
      this.$collapse.style.display = this.$button.active ? 'none' : 'initial';
    }
  }
}