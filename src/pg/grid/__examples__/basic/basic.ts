import { Component, Part, Prop } from '@pictogrammers/element';
import PgDatabase from 'pg/database/database';
import PgTooltip from 'pg/tooltip';
import { Icon } from '../../../shared/models/icon';
import PgGrid from '../../grid';

import template from './basic.html';

@Component({
  selector: 'x-pg-grid-basic',
  template
})
export default class XPgGridBasic extends HTMLElement {

  @Prop() fontId = 'D051337E-BC7E-11E5-A4E9-842B2B6CFE1B';

  @Part() $button0: HTMLButtonElement;
  @Part() $button1: HTMLButtonElement;
  @Part() $button10: HTMLButtonElement;
  @Part() $button50: HTMLButtonElement;
  @Part() $button250: HTMLButtonElement;
  @Part() $buttonAll: HTMLButtonElement;

  @Part() $sizeText: HTMLSpanElement;
  @Part() $paddingText: HTMLSpanElement;
  @Part() $gapText: HTMLSpanElement;

  @Part() $size: HTMLInputElement;
  @Part() $padding: HTMLInputElement;
  @Part() $gap: HTMLInputElement;

  @Part() $database: PgDatabase;
  @Part() $grid: PgGrid;
  @Part() $tooltip: PgTooltip;

  icons: Icon[] = [];

  connectedCallback() {
    this.$button0.addEventListener('click', () => {
      this.setIcons(0);
    });
    this.$button1.addEventListener('click', () => {
      this.setIcons(1);
    });
    this.$button10.addEventListener('click', () => {
      this.setIcons(10);
    });
    this.$button50.addEventListener('click', () => {
      this.setIcons(50);
    });
    this.$button250.addEventListener('click', () => {
      this.setIcons(250);
    });
    this.$buttonAll.addEventListener('click', () => {
      this.setIcons(-1);
    });
    this.$size.addEventListener('input', this.handleSize.bind(this));
    this.$padding.addEventListener('input', this.handlePadding.bind(this));
    this.$gap.addEventListener('input', this.handleGap.bind(this));

    this.$database.addEventListener('sync', this.handleSync.bind(this));
    this.$database.font = this.fontId;

    this.addEventListener('tooltip', this.handleTooltip.bind(this));
  }

  handleTooltip(e) {
    const { visible, rect, text, position } = e.detail;
    this.$tooltip.visible = visible;
    this.$tooltip.rect = rect;
    this.$tooltip.text = text;
    this.$tooltip.position = position;
    e.stopPropagation();
  }

  setIcons(count: number) {
    if (count === -1) {
      this.$grid.icons = this.icons;
    }
    // update array, fix later
    this.$grid.icons.push(...this.icons.slice(0, count));
  }

  async handleSync(e: CustomEvent) {
    const { db } = e.detail;
    const count = await db.getCount(this.fontId);
    console.log('Total Icons', count);
    const icons = await db.getIcons(this.fontId);
    console.log('Icon Objects:', icons.length);
    this.icons = icons;
    this.setIcons(10);
  }

  handleSize(e) {
    this.$grid.size = e.target.value;
    this.$sizeText.innerText = e.target.value;
  }

  handlePadding(e) {
    this.$grid.padding = e.target.value;
    this.$paddingText.innerText = e.target.value;
  }

  handleGap(e) {
    this.$grid.gap = e.target.value;
    this.$gapText.innerText = e.target.value;
  }

/*
      ele.addEventListener('select', (e) => {
        var icon = e.detail;
        alert(icon.name);
      });
      ele.addEventListener('entericon', (e) => {
        var icon = e.detail.icon;
        console.log('enter', e.detail);
        var rect = ele.getBoundingClientRect();
        tooltip3.style.position = 'fixed';
        tooltip3.style.left = `${e.detail.x}px`;
        tooltip3.style.top = `${e.detail.y}px`;
        tooltip3.width = e.detail.width;
        tooltip3.height = e.detail.height;
        tooltip3.text = icon.name;
        tooltip3.style.display = 'block';
      });
      ele.addEventListener('leaveicon', (e) => {
        var icon = e.detail;
        tooltip3.style.display = 'none';
        console.log('leave', e.detail);
      });
      ele.addEventListener('openmenu', (e) => {
        var icon = e.detail;
        console.log(e.detail);
      });
      ele.addEventListener('closemenu', (e) => {
        var icon = e.detail;
        console.log(e.detail);
      });
*/
}