import { Component, Prop, Part, normalizeString } from '@pictogrammers/element';
import '../pane/pane';
import type PgPane from '../pane/pane';
import './partials/divider';
import type PgPartialDivider from './partials/divider';

import template from './splitPanes.html';
import style from './splitPanes.css';

function remToPx(rem: number): number {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (fontSize || 16);
}

function pxToRem(px: number): number {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return px / (fontSize || 16);
}

@Component({
  selector: 'pg-split-panes',
  style,
  template
})
export default class PgSplitPanes extends HTMLElement {

  @Prop(normalizeString) direction: string = 'vertical';

  @Part() $slot: HTMLSlotElement;

  #panes: PgPane[] = [];

  connectedCallback() {
    this.$slot.addEventListener('slotchange', this.#handleSlotChange.bind(this));
  }

  render(changes: any) {
    if (changes.direction) {
      this.classList.toggle('horizontal', this.direction === 'horizontal');
      for (const divider of this.#dividers()) {
        divider.direction = this.direction;
      }
    }
  }

  #dividers(): PgPartialDivider[] {
    return Array.from(this.querySelectorAll(':scope > pg-partial-divider')) as PgPartialDivider[];
  }

  #handleSlotChange() {
    const panes = this.$slot.assignedElements().filter(
      (el) => el.tagName === 'PG-PANE'
    ) as PgPane[];

    const unchanged = panes.length === this.#panes.length
      && panes.every((pane, i) => pane === this.#panes[i]);
    if (unchanged) {
      return;
    }
    this.#panes = panes;

    for (const divider of this.#dividers()) {
      divider.remove();
    }

    panes.forEach((pane, i) => {
      if (i === 0) {
        return;
      }
      const divider = document.createElement('pg-partial-divider') as PgPartialDivider;
      divider.direction = this.direction;
      divider.label = panes[i].label;
      this.insertBefore(divider, pane);
      this.#wireDivider(divider, panes[i - 1], pane);
    });
  }

  #wireDivider(divider: PgPartialDivider, before: PgPane, after: PgPane) {
    let startBefore = 0;
    let startAfter = 0;

    divider.addEventListener('dragstart', () => {
      const horizontal = this.direction === 'horizontal';
      const beforeRect = before.getBoundingClientRect();
      const afterRect = after.getBoundingClientRect();
      startBefore = horizontal ? beforeRect.width : beforeRect.height;
      startAfter = horizontal ? afterRect.width : afterRect.height;
    });

    divider.addEventListener('drag', (e: any) => {
      const horizontal = this.direction === 'horizontal';
      const delta = horizontal ? e.detail.dx : e.detail.dy;
      const beforeMin = remToPx(before.minSize);
      const afterMin = remToPx(after.minSize);

      let beforePx = startBefore + delta;
      let afterPx = startAfter - delta;

      if (beforePx < beforeMin) {
        afterPx -= beforeMin - beforePx;
        beforePx = beforeMin;
      }
      if (afterPx < afterMin) {
        beforePx -= afterMin - afterPx;
        afterPx = afterMin;
      }
      beforePx = Math.max(beforePx, beforeMin);
      afterPx = Math.max(afterPx, afterMin);

      before.size = pxToRem(beforePx);
      after.size = pxToRem(afterPx);
    });
  }
}
