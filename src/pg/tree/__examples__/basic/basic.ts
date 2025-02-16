import { Component, Part, Prop } from '@pictogrammers/element';
import PgTree from '../../tree';

import template from './basic.html';
import PgTreeButtonIcon from '../../../treeButtonIcon/treeButtonIcon';

const IconEye = 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z';

@Component({
  selector: 'x-pg-tree-basic',
  template
})
export default class XPgTreeBasic extends HTMLElement {
  @Part() $tree: PgTree;
  @Part() $addItem: HTMLButtonElement;

  connectedCallback() {
    this.$tree.addEventListener('action', (e) => {
      // action clicked
      console.log('action')
    });
    this.$tree.addEventListener('rename', (e) => {
      // action clicked
    });
    this.$tree.addEventListener('menu', (e) => {
      // action clicked
    });
    this.$tree.items.push({
      key: 1,
      icon: {
        path: IconEye
      },
      label: 'Item 1',
      actions: [{
        type: PgTreeButtonIcon,
        icon: {
          path: IconEye
        }
      },
      {
        type: PgTreeButtonIcon,
        label: 'Delete',
        icon: {
          path: IconEye
        }
      }]
    },
    {
      key: 2,
      label: 'Item 2'
    });

    let next: number = 2;
    this.$addItem.addEventListener('click', () => {
      next++;
      this.$tree.items.push({
        key: `${next}`,
        label: `Item ${next}`
      });
    });
  }
}
