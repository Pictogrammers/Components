import { Component, Part, Prop } from '@pictogrammers/element';
import PgSearch from '../../search';
import { mdiAccount, mdiAccountBox, mdiAccountCircle } from './constants';

import template from './basic.html';

@Component({
  selector: 'x-pg-search-basic',
  template
})
export default class XPgSearchBasic extends HTMLElement {
  @Part() $search: PgSearch;

  connectedCallback() {
    this.$search.items = [
      { type: 'Documentation', name: 'Android', url: '/getting-started/android' },
      { type: 'Documentation', name: 'Angular', url: '/getting-started/angular' },
      { type: 'Documentation', name: 'AngularJS', url: '/getting-started/angularjs' },
      { type: 'Documentation', name: 'Bootstrap', url: '/getting-started/bootstrap' },
      { type: 'Documentation', name: 'How to Play Football', url: '/getting-started/football' },
      { type: 'Documentation', name: 'Foo Angular Foo Angular', url: '/getting-started/bootstraps' }
    ];
    this.$search.icons = [
      { name: 'account', data: mdiAccount, aliases: [{ name: 'user' }] },
      { name: 'account-box', data: mdiAccountBox, aliases: [{ name: 'user-box' }] },
      { name: 'account-circle', data: mdiAccountCircle, aliases: [{ name: 'user-circle' }] }
    ] as any;
  }
}