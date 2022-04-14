import { Component, Prop, Part } from '@pictogrammers/element';

import template from './tab.html';
import style from './tab.css';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Component({
  selector: 'pg-tab',
  style,
  template
})
export default class PgTab extends HTMLElement {

  @Prop() label: string = '';

  @Part() $tab: HTMLDivElement;

  uuid = uuid();

  connectedCallback() {

  }

  show() {
    this.$tab.classList.add('active');
  }

  hide() {
    this.$tab.classList.remove('active');
  }

  render(changes) {
    if (changes.label) {
      this.dispatchEvent(
        new CustomEvent('tab', {
          detail: {
            id: this.uuid,
            label: this.label
          },
          bubbles: true
        })
      );
    }
  }
}