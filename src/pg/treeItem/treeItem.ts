import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './treeItem.html';
import style from './treeItem.css';
import PgIcon from '../icon/icon';
import PgTreeButtonIcon from '../treeButtonIcon/treeButtonIcon';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Component({
  selector: 'pg-tree-item',
  style,
  template
})
export default class PgTreeItem extends HTMLElement {

  @Prop() index: number;
  @Prop() label: string = '';
  @Prop() selected: boolean = false;
  @Prop() icon: { path: string };
  @Prop() actions: any[] = [];
  @Prop() items: any[] = [];

  @Part() $item: HTMLDivElement;
  @Part() $input: HTMLInputElement;
  @Part() $button: HTMLButtonElement;
  @Part() $icon: PgIcon;
  @Part() $label: HTMLDivElement;
  @Part() $actions: HTMLDivElement;
  @Part() $items: HTMLDivElement;

  connectedCallback() {
    this.$item.addEventListener('action', this.#handleAction.bind(this));
    this.$button.addEventListener('dblclick', this.#handleDoubleClick.bind(this));
    this.$button.addEventListener('click', this.#handleClick.bind(this));
    this.$item.addEventListener('contextmenu', this.#handleContextMenu.bind(this));
    this.$input.addEventListener('blur', this.#handleBlur.bind(this));
    this.$input.addEventListener('keydown', this.#handleKeyDown.bind(this));
    this.$items.addEventListener('select', this.#handleSelect.bind(this));
    this.$items.addEventListener('rename', this.#handleRename.bind(this));
    forEach({
      container: this.$actions,
      items: this.actions,
      type: (item) => {
        return PgTreeButtonIcon;
      }
    });
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return PgTreeItem;
      }
    });
  }

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.icon && this.icon) {
      this.$icon.path = this.icon.path;
    }
    if (changes.selected) {
      this.$item.classList.toggle('selected', this.selected);
    }
    if (changes.items) {
      this.$items.classList.toggle('hide', this.items.length === 0);
    }
  }

  #handleClick() {
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index]
      }
    }));
  }

  #handleAction(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('action', {
      bubbles: true,
      composed: true,
      detail: {
        index: this.index,
        actionIndex: e.detail.index
      }
    }));
  }

  #handleRename(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleSelect(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleContextMenu(e) {
    e.preventDefault();
  }

  #handleDoubleClick(e) {
    this.$button.classList.add('hide');
    this.$actions.classList.add('hide');
    this.$input.classList.remove('hide');
    this.$input.value = this.label;
    this.$input.select();
    e.preventDefault();
  }

  #handleBlur() {
    this.$button.classList.remove('hide');
    this.$actions.classList.remove('hide');
    this.$input.classList.add('hide');
    this.$button.focus();
    this.dispatchEvent(new CustomEvent('rename', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        label: this.$input.value
      }
    }));
  }

  #handleKeyDown(e: KeyboardEvent) {
    switch (e.key ) {
      case 'Enter':
        this.#handleBlur();
        break;
      case 'Escape':
        this.$button.classList.remove('hide');
        this.$actions.classList.remove('hide');
        this.$input.classList.add('hide');
        this.$input.value = this.label;
        this.$button.focus();
        break;
    }
  }

}
