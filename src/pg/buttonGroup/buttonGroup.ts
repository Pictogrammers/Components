import { Component, Part, Prop } from '@pictogrammers/element';

import template from './buttonGroup.html';
import style from './buttonGroup.css';
import PgButton from '../button/button';
import PgButtonLink from '../buttonLink/buttonLink';

const PG_BUTTON = 'PG-BUTTON';
const PG_BUTTON_LINK = 'PG-BUTTON-LINK';

function isButton(ele: PgButton | PgButtonLink) {
  return ele.tagName === PG_BUTTON || ele.tagName === PG_BUTTON_LINK;
}

@Component({
  selector: 'pg-button-group',
  style,
  template
})
export default class PgButtonGroup extends HTMLElement {
  @Part() $slot: HTMLSlotElement;

  connectedCallback() {
    this.$slot.addEventListener('slotchange', this.handleSlotChange.bind(this))
  }

  handleSlotChange(e) {
    const elements = this.$slot.assignedElements();
    if (elements.length !== 0) {
      const first  = elements[0] as PgButton;
      if (isButton(first)) {
        first.start = true;
      }
      const last = elements[elements.length - 1] as PgButton;
      if (isButton(last)) {
        last.end = true;
      }
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as PgButton;
        if (isButton(element)) {
          element.center = !element.start && !element.end;
        }
      }
    }
  }

  render(changes) {

  }
}