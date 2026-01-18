import { Component, Prop, Part } from '@pictogrammers/element';

import template from './dropdown.html';
import style from './dropdown.css';

window.process = { env: {} } as any;

@Component({
  selector: 'pg-dropdown',
  style,
  template
})
export default class PgDropdown extends HTMLElement {
  @Part() $main: HTMLSlotElement;
  @Part() $popover: HTMLDivElement;
  @Part() $arrow: HTMLDivElement;

  isVisible = false;
  connectedCallback() {
    this.$main.addEventListener('slotchange', (e) => {
      var nodes = this.$main.assignedElements();
      for(var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        this.wireUpPopover(node);
      }
    });
  }

  wireUpPopover(node) {
    this.$popover.style.visibility = 'hidden';
    node.addEventListener('click', (e) => {
      this.$popover.style.visibility = this.isVisible ? 'hidden' : 'visible';
      this.isVisible = !this.isVisible;
      e.preventDefault();
    });
  }

  render() {

  }
}