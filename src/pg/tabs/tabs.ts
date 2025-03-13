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
  #focusedTab: number = 0;

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
      connect: ($tab, tab, $tabs: PgPartialTab[]) => {
        $tab.addEventListener('select', (e: any) => {
          const { index } = e.detail;
          const elements = this.$slot.assignedElements() as PgTab[];
          elements[this.#selectedTab].hide();
          $tabs[this.#selectedTab].selected = false;
          elements[index].show();
          $tabs[index].selected = true;
          this.#selectedTab = index;
        });
        $tab.addEventListener('arrowleft', (e: any) => {
          const { index } = e.detail;
          if (this.#tabs.length > 1) {
            if (index === 0) {
              this.#focusedTab = this.#tabs.length - 1;
            } else {
              this.#focusedTab = index - 1;
            }
            $tabs[this.#focusedTab].focus();
          }
        });
        $tab.addEventListener('arrowright',  (e: any) => {
          const { index } = e.detail;
          if (this.#tabs.length > 1) {
            if (index === this.#tabs.length - 1) {
              this.#focusedTab = 0;
            } else {
              this.#focusedTab++;
            }
            $tabs[this.#focusedTab].focus();
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

  handleSlotChange(e: Event) {
    const tabs = Array.from(this.$tabset.children) as PgPartialTab[];
    const elements = this.$slot.assignedElements() as PgTab[];
    if (elements.length !== 0) {
      elements[0].show();
      tabs[0].selected = true;
    }
  }

}