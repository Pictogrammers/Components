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

  tabs: any[] = [];

  connectedCallback() {
    this.addEventListener('tab', this.handleTab.bind(this));
    this.$slot.addEventListener('slotchange', this.handleSlotChange.bind(this));
    forEach({
      container: this.$tabset,
      items: this.tabs,
      type: (tab: any) => {
        return PgPartialTab;
      }
    });
  }

  handleTab(e: CustomEvent) {
    const { detail } = e;
    this.tabs.push(detail);


    /*list(
      this.$tabset,
      this.tabs,
      'id',
      (tab: any) => {
        const n = node<HTMLDivElement>(partialTab, {
          button: {
            innerText: tab.label
          }
        });
        const button = n.querySelector<HTMLDivElement>('[part="tab"]');
        button?.addEventListener('click', (e) => {
          this.selectTab(tab.id);
          this.dispatchEvent(new CustomEvent<any>('select', { detail: tab }));
        });
        button?.addEventListener('keydown', this.handleTabKeypress.bind(this));
        if (this.tabs[0].id === tab.id) {
          button?.classList.add('active');
        }
        return n;
      },
      (tab, $item) => {

      }
    );*/
    e.stopPropagation();
  }

  handleTabKeypress(e) {
    const tabs = Array.from(this.$tabset.children, x => x.children[0]);
    if (tabs.length === 1) {
      return;
    }
    const index = tabs.findIndex(x => x === e.target);
    const previousIndex = index === 0 ? tabs.length - 1 : index - 1;
    const nextIndex = index === tabs.length - 1 ? 0 : index + 1;
    const previousTab = this.tabs[previousIndex];
    const previousButton = tabs[previousIndex] as HTMLButtonElement;
    const nextTab = this.tabs[nextIndex];
    const nextButton = tabs[nextIndex] as HTMLButtonElement;
    switch(e.key) {
      case 'ArrowLeft':
        if (previousTab) {
          previousButton.focus();
          this.selectTab(previousTab.id);
        }
        break;
      case 'ArrowRight':
        if (nextTab) {
          nextButton.focus();
          this.selectTab(nextTab.id);
        }
        break;
    }
  }

  handleSlotChange(e) {
    const elements = this.$slot.assignedElements() as PgTab[];
    if (elements.length !== 0) {
      elements[0].show();
    }
  }

  selectTab(id: string) {
    const tabs = Array.from(this.$tabset.children) as HTMLElement[];
    for (let tab of tabs) {
      tab.classList.toggle('active', tab.dataset['key'] === id);
    }
    const elements = this.$slot.assignedElements() as PgTab[];
    elements.forEach(e => e.hide());
    const tab = elements.find(e => e.uuid === id) as PgTab;
    tab.show();
  }
}