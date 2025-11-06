import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgIcon from '../icon/icon';
import PgTreeButtonIcon from '../treeButtonIcon/treeButtonIcon';

import template from './treeItem.html';
import style from './treeItem.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-tree-item',
  style,
  template
})
export default class PgTreeItem extends HTMLElement {

  @Prop() index: number;
  @Prop() label: string = '';
  @Prop() selected: boolean = false;
  @Prop() expanded: boolean = false;
  @Prop() icon: { path: string } = { path: noIcon };
  @Prop() actions: any[] = [];
  @Prop() items: any[] = [];

  @Part() $toggle: HTMLButtonElement;
  @Part() $item: HTMLDivElement;
  @Part() $input: HTMLInputElement;
  @Part() $iconButton: HTMLButtonElement;
  @Part() $icon: PgIcon;
  @Part() $label: HTMLDivElement;
  @Part() $labelButton: HTMLButtonElement;
  @Part() $actions: HTMLDivElement;
  @Part() $items: HTMLDivElement;
  @Part() $dropabove: HTMLDivElement;
  @Part() $dropon: HTMLDivElement;
  @Part() $dropbelow: HTMLDivElement;

  connectedCallback() {
    this.$toggle.addEventListener('click', this.#handleToggleClick.bind(this));
    this.$item.addEventListener('action', this.#handleItemAction.bind(this));
    this.$item.addEventListener('pointerenter', this.#handlePointerEnter.bind(this));
    this.$item.addEventListener('pointerleave', this.#handlePointerLeave.bind(this));
    this.$item.addEventListener('dragstart', this.#handleDragStart.bind(this));
    this.$item.addEventListener('dragend', this.#handleDragEnd.bind(this));
    this.$labelButton.addEventListener('dblclick', this.#handleDoubleClick.bind(this));
    this.$labelButton.addEventListener('click', this.#handleClick.bind(this));
    this.$labelButton.addEventListener('keydown', this.#handleKeyDownLabel.bind(this));
    this.$iconButton.addEventListener('dblclick', this.#handleIconDoubleClick.bind(this));
    this.$iconButton.addEventListener('click', this.#handleIconClick.bind(this));
    this.$iconButton.addEventListener('keydown', this.#handleIconKeyDown.bind(this));
    this.$item.addEventListener('contextmenu', this.#handleContextMenu.bind(this));
    this.$input.addEventListener('blur', this.#handleBlur.bind(this));
    this.$input.addEventListener('keydown', this.#handleInputKeyDown.bind(this));
    // Append Indexes
    this.$items.addEventListener('action', this.#handleAction.bind(this));
    this.$items.addEventListener('move', this.#handleMove.bind(this));
    this.$items.addEventListener('toggle', this.#handleToggle.bind(this));
    this.$items.addEventListener('select', this.#handleSelect.bind(this));
    this.$items.addEventListener('rename', this.#handleRename.bind(this));
    this.$items.addEventListener('up', this.#handleUp.bind(this));
    this.$items.addEventListener('down', this.#handleDown.bind(this));
    this.$items.addEventListener('itemdragstart', this.#handleItemDragStart.bind(this));
    this.$items.addEventListener('itemdragend', this.#handleItemDragEnd.bind(this));
    this.$items.addEventListener('itemdropenter', this.#handleItemDropEnter.bind(this));
    // Drop
    this.$dropabove.addEventListener('dragenter', this.#handleDragAboveEnter.bind(this));
    this.$dropabove.addEventListener('dragleave', this.#handleDragAboveLeave.bind(this));
    this.$dropabove.addEventListener('dragover', this.#handleDragOver.bind(this));
    this.$dropabove.addEventListener('drop', this.#handleDragAbove.bind(this));
    this.$dropon.addEventListener('dragenter', this.#handleDragOnEnter.bind(this));
    this.$dropon.addEventListener('dragleave', this.#handleDragOnLeave.bind(this));
    this.$dropon.addEventListener('dragover', this.#handleDragOver.bind(this));
    this.$dropon.addEventListener('drop', this.#handleDropOn.bind(this));
    this.$dropbelow.addEventListener('dragenter', this.#handleDragBelowEnter.bind(this));
    this.$dropbelow.addEventListener('dragleave', this.#handleDragBelowLeave.bind(this));
    this.$dropbelow.addEventListener('dragover', this.#handleDragOver.bind(this));
    this.$dropbelow.addEventListener('drop', this.#handleDropBelow.bind(this));

    forEach({
      container: this.$actions,
      items: this.actions,
      type: (item) => {
        return PgTreeButtonIcon;
      }
    });
    if (this.expanded) {
      this.#initItems();
    }
  }

  disconnectedCallback() {
    console.log('disconnect', this.index);
  }

  #initItemsOnce = true;
  #initItems() {
    if (this.#initItemsOnce) {
      forEach({
        container: this.$items,
        items: this.items,
        type: (item) => {
          return PgTreeItem;
        }
      });
      this.#initItemsOnce = false;
    }
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
      this.$item.classList.toggle('items', this.items.length !== 0);
    }
    if (changes.expanded) {
      if (this.expanded) {
        this.#initItems();
      }
      this.$item.classList.toggle('expanded', this.expanded);
      this.$items.classList.toggle('expanded', this.expanded);
    }
  }

  #handleToggleClick() {
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index]
      }
    }));
  }

  #handleIconDoubleClick(e: MouseEvent) {
    const { ctrlKey, shiftKey } = e;
    if (ctrlKey || shiftKey) {
      return;
    }
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'icondoubleclick',
        indexes: [this.index]
      }
    }));
  }

  #handleIconClick() {
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'icon',
        indexes: [this.index]
      }
    }));
  }

  #handleClick(e: MouseEvent) {
    if (this.#ignoreNextClick) {
      this.#ignoreNextClick = false;
      return;
    }
    const { ctrlKey, shiftKey } = e;
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'label',
        indexes: [this.index],
        ctrlKey,
        shiftKey
      }
    }));
  }

  #handleKeyDownLabel(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#enableRename();
      e.preventDefault();
    }
    // todo arrow keys
  }

  #handlePointerEnter() {
    this.dispatchEvent(new CustomEvent('enter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index]
      }
    }));
  }

  #handlePointerLeave() {
    this.dispatchEvent(new CustomEvent('leave', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index]
      }
    }));
  }

  #handleItemAction(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('action', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        actionIndex: e.detail.index
      }
    }));
  }

  #handleAction(e) {
    e.detail.indexes.unshift(this.index);
  }

  #handleMove(e) {
    e.detail.indexes.unshift(this.index);
  }

  #handleToggle(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleRename(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleUp(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleDown(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleSelect(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleItemDropEnter(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleContextMenu(e) {
    e.preventDefault();
  }

  #enableRename() {
    this.$labelButton.classList.add('hide');
    this.$actions.classList.add('hide');
    this.$input.classList.remove('hide');
    this.$input.value = this.label;
    this.$input.select();
    this.#ignoreNextClick = true;
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'rename',
        indexes: [this.index]
      }
    }));
  }

  #ignoreNextClick = false;
  #handleDoubleClick(e: MouseEvent) {
    const { ctrlKey, shiftKey } = e;
    if (ctrlKey || shiftKey) {
      return;
    }
    this.#enableRename();
    e.preventDefault();
  }

  #handleBlur() {
    this.$labelButton.classList.remove('hide');
    this.$actions.classList.remove('hide');
    this.$input.classList.add('hide');
    this.$labelButton.click();
    this.dispatchEvent(new CustomEvent('rename', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        label: this.$input.value
      }
    }));
  }

  #handleIconKeyDown(e: KeyboardEvent) {
    switch (e.key ) {
      case 'ArrowUp':
        this.dispatchEvent(new CustomEvent('up', {
          bubbles: true,
          composed: true,
          detail: { indexes: [this.index] }
        }));
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.dispatchEvent(new CustomEvent('down', {
          bubbles: true,
          composed: true,
          detail: { indexes: [this.index] }
        }));
        e.preventDefault();
        break;
    }
  }

  #handleInputKeyDown(e: KeyboardEvent) {
    switch (e.key ) {
      case 'Enter':
        this.#handleBlur();
        break;
      case 'Escape':
        this.$labelButton.classList.remove('hide');
        this.$actions.classList.remove('hide');
        this.$input.classList.add('hide');
        this.$input.value = this.label;
        this.$labelButton.click();
        break;
      case 'ArrowUp':
        this.dispatchEvent(new CustomEvent('up', {
          bubbles: true,
          composed: true,
          detail: { indexes: [this.index] }
        }));
        this.$labelButton.classList.remove('hide');
        this.$actions.classList.remove('hide');
        this.$input.classList.add('hide');
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.dispatchEvent(new CustomEvent('down', {
          bubbles: true,
          composed: true,
          detail: { indexes: [this.index] }
        }));
        this.$labelButton.classList.remove('hide');
        this.$actions.classList.remove('hide');
        this.$input.classList.add('hide');
        e.preventDefault();
        break;
    }
  }

  #canvas;
  #handleDragStart(event) {
    let dragCount = 0;
    this.dispatchEvent(new CustomEvent('itemdragstart', {
      bubbles: true,
      composed: true,
      detail: {
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        indexes: [this.index],
        callback: (count) => {
          dragCount = count;
        }
      }
    }));
    this.$item.classList.toggle('dragging', true);
    this.$items.classList.toggle('dragging', true);
    // Generate drag image showing selected item count
    const size = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    // Larger than required!
    canvas.width = 100 * size;
    canvas.height = 40 * size;
    canvas.style.width = `${canvas.width / size}px`;
    // overlap cursor offset
    const offsetInline = 20;
    const fontSize = 16;
    const paddingBlock = 6;
    const paddingInline = 6;
    var ctx = canvas.getContext('2d');
    if (ctx) {
      const text = `${dragCount}`;
      ctx.font = `bold ${fontSize * size}px Segoe UI`;
      const textSize = ctx.measureText(text);
      ctx.fillStyle = '#453C4F';
      ctx.beginPath();
      ctx.roundRect(
        (offsetInline) * size,
        0,
        (textSize.width + (paddingInline * 2)) * size,
        (fontSize + (paddingBlock * 2)) * size,
        8 + (size * 2)
      );
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.roundRect(
        (offsetInline + 2) * size,
        2 * size,
        ((textSize.width + (paddingInline * 2) - 4) * size),
        ((fontSize + (paddingBlock * 2) - 4) * size),
        8
      );
      ctx.fill();
      ctx.fillStyle = '#453C4F';
      ctx.fillText(
        text,
        (offsetInline + paddingInline + 4) * size,
        (fontSize + paddingBlock - 2) * size
      );
    }
    event.dataTransfer.setDragImage(canvas, 0, 0);
    this.#canvas = canvas;
  }

  #handleDragEnd(event) {
    this.dispatchEvent(new CustomEvent('itemdragend', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index] }
    }));
    this.$item.classList.toggle('dragging', false);
    this.$items.classList.toggle('dragging', false);
    this.#canvas.remove();
  }

  #handleItemDragStart(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleItemDragEnd(e: any) {
    e.detail.indexes.unshift(this.index);
  }

  #handleDragAboveEnter(e: any) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid) => {
          if (isValid) {
            e.dataTransfer.dropEffect = 'move';
          }
        }
      }
    }));
    e.target.classList.toggle('drop', true);
    e.dataTransfer.setData("text", 'test');
    e.dataTransfer.effectAllowed = 'move';
  }

  #handleDragAboveLeave(e: any) {
    console.log('darg leave');
    e.target.classList.toggle('drop', false);
  }

  #dragOnTimer;
  #handleDragOnEnter(e: any) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid) => {
          if (isValid) {
            e.dataTransfer.dropEffect = 'move';
          }
        }
      }
    }));
    e.target.classList.toggle('drop', true);
    this.#dragOnTimer = setTimeout(() => {
      this.#handleToggleClick();
    }, 1500);
  }

  #handleDragOnLeave(e: any) {
    clearTimeout(this.#dragOnTimer);
    console.log('darg leave');
    e.target.classList.toggle('drop', false);
  }

  #handleDragBelowEnter(e: any) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid) => {
          if (isValid) {
            e.dataTransfer.dropEffect = 'move';
          }
        }
      }
    }));
    e.target.classList.toggle('drop', true);
  }

  #handleDragBelowLeave(e: any) {
    console.log('darg leave');
    e.target.classList.toggle('drop', false);
  }

  #handleDragOver(e: any) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  #handleDragAbove(e: any) {
    e.target.classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        position: 'before'
      }
    }));
  }

  #handleDropOn(e: any) {
    e.target.classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        position: 'on'
      }
    }));
  }

  #handleDropBelow(e: any) {
    e.target.classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        position: 'after'
      }
    }));
  }

}
