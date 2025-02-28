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
  @Prop() icon: { path: string };
  @Prop() actions: any[] = [];

  @Part() $item: HTMLDivElement;
  @Part() $input: HTMLInputElement;
  @Part() $button: HTMLButtonElement;
  @Part() $icon: PgIcon;
  @Part() $label: HTMLDivElement;
  @Part() $actions: HTMLDivElement;

  connectedCallback() {
    this.$item.addEventListener('action', this.#handleAction.bind(this));
    this.$button.addEventListener('dblclick', this.#handleRename.bind(this));
    this.$item.addEventListener('contextmenu', this.#handleContextMenu.bind(this));
    this.$input.addEventListener('blur', this.#handleBlur.bind(this));
    this.$input.addEventListener('keydown', this.#handleKeyDown.bind(this));
    forEach({
      container: this.$actions,
      items: this.actions,
      type: (item) => {
        return PgTreeButtonIcon;
      },
      create: ($item, item) => {
        // after creation of $item element
      },
      update: ($item, item) => {
        // after every $item update
      },
    });
  }

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.icon && this.icon) {
      this.$icon.path = this.icon.path;
    }
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

  #handleContextMenu(e) {
    e.preventDefault();
  }

  #handleRename(e) {
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
        index: this.index,
        label: this.$input.value
      }
    }));
  }

  #handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#handleBlur();
    }
  }

}
