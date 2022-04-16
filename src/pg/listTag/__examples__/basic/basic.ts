import { Component, Part, Prop } from '@pictogrammers/element';
import PgListTag from '../../listTag';
import { tags } from './constants';

import template from './basic.html';
import { Tag } from '../../../shared/models/tag';

@Component({
  selector: 'x-pg-list-tag-basic',
  template
})
export default class XPgIconBasic extends HTMLElement {
  @Part() $tags: PgListTag;
  @Part() $buttonClear: HTMLButtonElement;
  @Part() $buttonAdd: HTMLButtonElement;
  @Part() $buttonRemove: HTMLButtonElement;
  @Part() $buttonEdit: HTMLButtonElement;

  connectedCallback() {
    this.$buttonClear.addEventListener('click', this.handleClear.bind(this));
    this.$buttonAdd.addEventListener('click', this.handleAdd.bind(this));
    this.$buttonRemove.addEventListener('click', this.handleRemove.bind(this));
    this.$buttonEdit.addEventListener('click', this.handleEdit.bind(this));
    this.$tags.items = tags;
  }

  handleClear() {
    this.$tags.items = [];
  }

  uuid = 4;

  handleAdd() {
    this.$tags.items = [
      ...this.$tags.items,
      new Tag().from({
        id: `uuid${this.uuid++}`,
        count: 42,
        name: 'Foo Bar',
        url: 'foo-bar'
      })
    ];
  }

  handleRemove() {
    this.$tags.items = this.$tags.items.slice(0, this.$tags.items.length - 1);
  }

  handleEdit() {
    this.$tags.edit = !this.$tags.edit;
  }

}