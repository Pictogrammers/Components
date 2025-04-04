import { Component, Part, Prop } from '@pictogrammers/element';
import PgTree from '../../tree';

import template from './basic.html';
import PgTreeButtonIcon from '../../../treeButtonIcon/treeButtonIcon';

const IconAccount = 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z';
const IconEye = 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z';
const IconEyeOff = 'M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z';
const IconLock = 'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z';
const IconUnlock = 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z';

function createItem(label, expanded = false) {
  return {
    icon: {
      path: IconAccount
    },
    label,
    expanded,
    actions: [{
      type: PgTreeButtonIcon,
      icon:  IconEye,
      enabled: true
    },
    {
      type: PgTreeButtonIcon,
      label: 'Delete',
      icon: IconUnlock,
      enabled: false
    }],
    items: [{
      label: 'Sub Item 1'
    }, {
      label: 'Sub Item 2',
      items: [{
        label: 'Sub Item ?',
      }]
    }, {
      label: 'Sub Item 3'
    }]
  };
}

@Component({
  selector: 'x-pg-tree-basic',
  template
})
export default class XPgTreeBasic extends HTMLElement {
  @Part() $tree: PgTree;
  @Part() $addItem: HTMLButtonElement;
  @Part() $removeItem: HTMLButtonElement;
  @Part() $updateItem: HTMLButtonElement;

  connectedCallback() {
    this.$tree.addEventListener('action', (e: any) => {
      // action clicked
      const { index, actionIndex } = e.detail;
      const action = this.$tree.items[index].actions[actionIndex];
      const { enabled } = action;
      if (actionIndex === 0 && enabled) {
        action.icon = IconEyeOff;
        action.enabled = false;
      } else if (actionIndex === 0 && !enabled){
        action.icon = IconEye;
        action.enabled = true;
      }
      if (actionIndex === 1 && enabled) {
        action.icon = IconUnlock;
        action.enabled = false;
      } else if (actionIndex === 1 && !enabled){
        action.icon = IconLock;
        action.enabled = true;
      }
    });
    this.$tree.addEventListener('rename', (e: any) => {
      const { indexes, label } = e.detail;
      const item = this.#getItem(indexes);
      item.label = label;
    });
    let previousIndexes = null;
    this.$tree.addEventListener('select', (e: any) => {
      const { indexes } = e.detail;
      const item = this.#getItem(indexes);
      item.selected = true;
      if (previousIndexes) {
        const previousItem = this.#getItem(previousIndexes);
        previousItem.selected = false;
      }
      previousIndexes = indexes;
    });
    this.$tree.addEventListener('menu', (e: any) => {
      // action clicked
    });
    this.$tree.items = [
      createItem('Item 1', true),
      createItem('Item 2')
    ];

    let next: number = 2;
    this.$addItem.addEventListener('click', () => {
      next++;
      this.$tree.items.push(createItem(`Item ${next}`));
    });

    this.$removeItem.addEventListener('click', () => {
      this.$tree.items.pop();
    });

    let updatedTimes = 0;
    this.$updateItem.addEventListener('click', () => {
      this.$tree.items[1].label = `Updated ${updatedTimes++}`;
    });
  }

  #getItem(indexes: number[]) {
    return indexes.reduce((item, index) => {
      return item.items[index];
    }, this.$tree);
  }
}
