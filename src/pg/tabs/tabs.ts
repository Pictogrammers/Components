import { Component, Prop, Part, node, forEach } from '@pictogrammers/element';
import PgTab from '../tab/tab';

import template from './tabs.html';
import style from './tabs.css';
import PgPartialTab from './partials/tab';

@Component({
  selector: 'pg-tabs',
  style,
  template
})
export default class PgTabs extends HTMLElement {

  @Part() $tabset: HTMLUListElement;
  @Part() $slot: HTMLSlotElement;

  @Prop()
  #tabs: any[] = [];

  #selectedTab: number = 0;

  connectedCallback() {
    this.addEventListener('tab', this.#handleTab.bind(this));
    this.$slot.addEventListener('slotchange', this.handleSlotChange.bind(this));
    forEach({
      container: this.$tabset,
      items: this.#tabs,
      type: (tab: any) => {
        return PgPartialTab;
      },
      // @ts-ignore
      connect: ($tab, tab, $tabs) => {
        $tab.addEventListener('select', (e: any) => {
          const { index } = e.detail;
          console.log(index, this.#tabs[e.detail.index]);
          const elements = this.$slot.assignedElements() as PgTab[];
          elements[this.#selectedTab].hide();
          elements[index].show();
          this.#selectedTab = index;
        });
        $tab.addEventListener('arrowleft',  (e: any) => {
          const { index } = e.detail;
          if (this.#tabs.length > 1) {
            if (index === 0) {
              this.#selectedTab = this.#tabs.length - 1;
            } else {
              this.#selectedTab = index - 1;
            }
            $tabs[this.#selectedTab].focus();
          }
        });
        $tab.addEventListener('arrowright',  (e: any) => {
          const { index } = e.detail;
          if (this.#tabs.length > 1) {
            if (index === this.#tabs.length - 1) {
              this.#selectedTab = 0;
            } else {
              this.#selectedTab++;
            }
            $tabs[this.#selectedTab].focus();
          }
        });
      }
    });
  }

  #handleTab(e: CustomEvent) {
    const { detail } = e;
    this.#tabs.push(detail);
    e.stopPropagation();
  }

  handleSlotChange(e) {
    const elements = this.$slot.assignedElements() as PgTab[];
    if (elements.length !== 0) {
      elements[0].show();
    }
  }

}