import { Component, Part } from '@pictogrammers/element';

import PgMenuItem from '../../menuItemIcon';

import template from './basic.html';

const IconFile = 'M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z';
const IconFolder = 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z';

@Component({
  selector: 'x-pg-menu-item-icon-basic',
  template
})
export default class XPgMenuItemIconBasic extends HTMLElement {
  @Part() $item: PgMenuItem;
  @Part() $checkedToggle: HTMLInputElement;
  @Part() $disabledToggle: HTMLInputElement;
  @Part() $iconFile: HTMLButtonElement;
  @Part() $iconFolder: HTMLButtonElement;
  @Part() $checkedValue: HTMLDivElement;
  @Part() $disabledValue: HTMLDivElement;

  connectedCallback() {
    this.$item.icon = IconFile;
    this.$item.label = 'Item 1';
    this.$item.checked = false;
    this.$item.disabled = false;

    this.$checkedValue.textContent = `${this.$item.checked}`;
    this.$disabledValue.textContent = `${this.$item.disabled}`;

    this.$item.addEventListener('select', (e: any) => {
      this.$checkedToggle.checked = e.target.checked;
      this.$checkedValue.textContent = `${this.$item.checked}`;
    });

    this.$iconFile.addEventListener('click', () => {
      this.$item.icon = IconFile;
    });

    this.$iconFolder.addEventListener('click', () => {
      this.$item.icon = IconFolder;
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