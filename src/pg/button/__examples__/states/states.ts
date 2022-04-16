import { Component, Part, Prop } from '@pictogrammers/element';
import PgButton from '../../button';

import template from './states.html';

@Component({
  selector: 'x-pg-button-states',
  template
})
export default class XPgButtonStates extends HTMLElement {
  @Part() $active: PgButton;

  connectedCallback() {
    this.$active.addEventListener('click', this.handleActive.bind(this));
  }

  handleActive() {
    this.$active.active = !this.$active.active;
  }
}