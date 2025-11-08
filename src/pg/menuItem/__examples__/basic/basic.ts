import { Component, Part } from '@pictogrammers/element';

import PgMenuItem from '../../menuItem';

import template from './basic.html';

@Component({
  selector: 'x-pg-menu-item-basic',
  template
})
export default class XPgMenuItemBasic extends HTMLElement {
  @Part() $item: PgMenuItem;
  @Part() $checkedToggle: HTMLInputElement;
  @Part() $disabledToggle: HTMLInputElement;
  @Part() $checkedValue: HTMLDivElement;
  @Part() $disabledValue: HTMLDivElement;

  connectedCallback() {
    this.$item.label = 'Item 1';
    this.$item.checked = false;
    this.$item.disabled = false;

    this.$checkedValue.textContent = `${this.$item.checked}`;
    this.$disabledValue.textContent = `${this.$item.disabled}`;

    this.$item.addEventListener('select', (e: any) => {
      this.$checkedToggle.checked = e.target.checked;
      this.$checkedValue.textContent = `${this.$item.checked}`;
    });

    this.$checkedToggle.addEventListener('change', (e: any) => {
      this.$item.checked = e.target.checked;
      this.$checkedValue.textContent = `${this.$item.checked}`;
    });

    this.$disabledToggle.addEventListener('change', (e: any) => {
      this.$item.disabled = e.target.checked;
      this.$disabledValue.textContent = `${this.$item.disabled}`;
    });
  }
}