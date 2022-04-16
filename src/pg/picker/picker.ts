import { Component, Prop, Part } from '@pictogrammers/element';
import PgButton from '../button/button';
import PgGrid from '../grid/grid';
import { createPopper } from '@popperjs/core';

import template from './picker.html';
import style from './picker.css';

window.process = { env: {} } as any;

@Component({
  selector: 'pg-picker',
  style,
  template
})
export default class PgPicker extends HTMLElement { // extends PgButton = bug in parent symbol
  @Prop() icons: any[] = [];

  @Part() $popover: HTMLDivElement;
  @Part() $arrow: HTMLDivElement;

  @Part() $search: HTMLDivElement;
  @Part() $grid: PgGrid;

  isVisible = false;
  connectedCallback() {
    /*createPopper(this.$button, this.$popover, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [-4, 8],
          },
        },
        {
          name: 'arrow',
          options: {
            element: this.$arrow,
            padding: 0,
          },
        },
      ]
    });
    this.$popover.style.visibility = 'hidden';
    this.$button.addEventListener('click', () => {
      this.$popover.style.visibility = this.isVisible ? 'hidden' : 'visible';
      this.isVisible = !this.isVisible;
      if (this.isVisible) {
        this.$search.focus();
      }
    });
    this.$search.addEventListener('input', (e: any) => {
      this.search = e.target.value;
      this.render();
    });*/
  }

  search: string = '';

  render() {
    this.$grid.icons = this.icons.filter((icon) => {
      return icon.name.indexOf(this.search) !== -1;
    });
  }
}