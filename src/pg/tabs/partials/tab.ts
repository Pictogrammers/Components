import { Component, Prop, Part, node, forEach } from '@pictogrammers/element';

import template from './tab.html';

@Component({
  selector: 'pg-partial-tab',
  template
})
export default class PgPartialTab extends HTMLElement {

  @Prop() index: number;
  @Prop() label: string = '';
  @Prop() selected: boolean = false;

  @Part() $tab: HTMLLIElement;
  @Part() $button: HTMLButtonElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
    this.$button.addEventListener('keydown', this.#handleKeyDown.bind(this));
  }

  render(changes) {
    if (changes.label) {
      this.$button.textContent = this.label;
    }
    if (changes.selected) {
      this.$button.classList.toggle('selected', this.selected);
    }
  }

  #handleClick() {
    const selectEvent = new CustomEvent('select', {
      detail: {
        index: this.index
      }
    });
    this.dispatchEvent(selectEvent);
  }

  #handleKeyDown(e: KeyboardEvent) {
    switch(e.key) {
      case 'ArrowLeft':
        const arrowLeftEvent = new CustomEvent('arrowleft', {
          detail: {
            index: this.index
          }
        });
        this.dispatchEvent(arrowLeftEvent);
        break;
      case 'ArrowRight':
        const arrowRightEvent = new CustomEvent('arrowright', {
          detail: {
            index: this.index
          }
        });
        this.dispatchEvent(arrowRightEvent);
        break;
    }
  }

  focus() {
    this.$button.focus();
  }

}