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
  @Prop() isFolder: boolean = false;
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
    // Bubble indexes up through nested items containers
    this.$items.addEventListener('action', this.#handleAction.bind(this));
    this.$items.addEventListener('move', this.#handleMove.bind(this));
    this.$items.addEventListener('toggle', this.#handleToggle.bind(this));
    this.$items.addEventListener('select', this.#handleSelect.bind(this));
    this.$items.addEventListener('rename', this.#handleRename.bind(this));
    this.$items.addEventListener('menu', this.#handleMenu.bind(this));
    this.$items.addEventListener('up', this.#handleUp.bind(this));
    this.$items.addEventListener('down', this.#handleDown.bind(this));
    this.$items.addEventListener('itemdragstart', this.#handleItemDragStart.bind(this));
    this.$items.addEventListener('itemdragend', this.#handleItemDragEnd.bind(this));
    this.$items.addEventListener('itemdropenter', this.#handleItemDropEnter.bind(this));
    this.$items.addEventListener('expand', this.#handleItemExpand.bind(this));
    // Drop zones
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
      type: (item) => item.type || PgTreeButtonIcon
    });
    if (this.expanded) {
      this.#initItems();
    }
  }

  disconnectedCallback() {
    window.clearTimeout(this.#dragOnTimer);
    this.#canvas?.remove();
    this.#canvas = null;
  }

  #initItemsOnce = true;
  #initItems() {
    if (this.#initItemsOnce) {
      forEach({
        container: this.$items,
        items: this.items,
        type: () => PgTreeItem
      });
      this.#initItemsOnce = false;
    }
  }

  render(changes: Record<string, boolean>) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.icon && this.icon) {
      this.$icon.path = this.icon.path;
    }
    if (changes.selected) {
      this.$item.classList.toggle('selected', this.selected);
    }
    if (changes.items || changes.isFolder) {
      this.$item.classList.toggle('items', this.isFolder || this.items.length !== 0);
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
      detail: { indexes: [this.index] }
    }));
  }

  #handleIconDoubleClick(e: MouseEvent) {
    if (e.ctrlKey || e.shiftKey) return;
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
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'label',
        indexes: [this.index],
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey
      }
    }));
  }

  #handleKeyDownLabel(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.#enableRename();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      this.dispatchEvent(new CustomEvent('up', {
        bubbles: true,
        composed: true,
        detail: { indexes: [this.index] }
      }));
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      this.dispatchEvent(new CustomEvent('down', {
        bubbles: true,
        composed: true,
        detail: { indexes: [this.index] }
      }));
      e.preventDefault();
    }
  }

  #handlePointerEnter() {
    this.dispatchEvent(new CustomEvent('enter', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index] }
    }));
  }

  #handlePointerLeave() {
    this.dispatchEvent(new CustomEvent('leave', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index] }
    }));
  }

  #handleItemAction(e: any) {
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

  #handleAction(e: any) { e.detail.indexes.unshift(this.index); }
  #handleMove(e: any) { e.detail.indexes.unshift(this.index); }
  #handleToggle(e: any) { e.detail.indexes.unshift(this.index); }
  #handleRename(e: any) { e.detail.indexes.unshift(this.index); }
  #handleMenu(e: any) { e.detail.indexes.unshift(this.index); }
  #handleUp(e: any) { e.detail.indexes.unshift(this.index); }
  #handleDown(e: any) { e.detail.indexes.unshift(this.index); }
  #handleSelect(e: any) { e.detail.indexes.unshift(this.index); }
  #handleItemDropEnter(e: any) { e.detail.indexes.unshift(this.index); }

  #handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('menu', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        x: e.clientX,
        y: e.clientY
      }
    }));
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
    if (e.ctrlKey || e.shiftKey) return;
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
    switch (e.key) {
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
    switch (e.key) {
      case 'Enter':
        this.#handleBlur();
        break;
      case 'Escape':
        e.stopPropagation();
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

  #canvas: HTMLCanvasElement | null = null;
  #handleDragStart(event: DragEvent) {
    let dragCount = 0;
    this.dispatchEvent(new CustomEvent('itemdragstart', {
      bubbles: true,
      composed: true,
      detail: {
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        indexes: [this.index],
        callback: (count: number) => {
          dragCount = count;
        }
      }
    }));
    this.$item.classList.toggle('dragging', true);
    this.$items.classList.toggle('dragging', true);
    // Generate drag image showing selected item count
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    // Position off-screen so it doesn't flash before becoming the drag image
    canvas.style.position = 'absolute';
    canvas.style.top = '-200px';
    canvas.style.left = '-200px';
    document.body.append(canvas);
    const offsetInline = 20;
    const fontSize = 16;
    const paddingBlock = 6;
    const paddingInline = 6;
    canvas.width = 100 * dpr;
    canvas.height = 40 * dpr;
    canvas.style.width = `${canvas.width / dpr}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const text = `${dragCount}`;
      ctx.font = `bold ${fontSize * dpr}px Segoe UI`;
      const textSize = ctx.measureText(text);
      ctx.fillStyle = '#453C4F';
      ctx.beginPath();
      ctx.roundRect(
        offsetInline * dpr,
        0,
        (textSize.width + paddingInline * 2) * dpr,
        (fontSize + paddingBlock * 2) * dpr,
        8 + dpr * 2
      );
      ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.roundRect(
        (offsetInline + 2) * dpr,
        2 * dpr,
        (textSize.width + paddingInline * 2 - 4) * dpr,
        (fontSize + paddingBlock * 2 - 4) * dpr,
        8
      );
      ctx.fill();
      ctx.fillStyle = '#453C4F';
      ctx.fillText(
        text,
        (offsetInline + paddingInline + 4) * dpr,
        (fontSize + paddingBlock - 2) * dpr
      );
    }
    event.dataTransfer!.setDragImage(canvas, 0, 0);
    this.#canvas = canvas;
  }

  #handleDragEnd(_event: DragEvent) {
    this.dispatchEvent(new CustomEvent('itemdragend', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index] }
    }));
    this.$item.classList.toggle('dragging', false);
    this.$items.classList.toggle('dragging', false);
    this.#canvas?.remove();
    this.#canvas = null;
  }

  #handleItemDragStart(e: any) { e.detail.indexes.unshift(this.index); }
  #handleItemDragEnd(e: any) { e.detail.indexes.unshift(this.index); }
  #handleItemExpand(e: any) { e.detail.indexes.unshift(this.index); }

  #handleDragAboveEnter(e: DragEvent) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid: boolean) => {
          if (isValid) {
            e.dataTransfer!.dropEffect = 'move';
          }
        }
      }
    }));
    (e.target as HTMLElement).classList.toggle('drop', true);
  }

  #handleDragAboveLeave(e: DragEvent) {
    (e.target as HTMLElement).classList.toggle('drop', false);
  }

  #dragOnTimer: number | undefined;
  #handleDragOnEnter(e: DragEvent) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid: boolean) => {
          if (isValid) {
            e.dataTransfer!.dropEffect = 'move';
          }
        }
      }
    }));
    (e.target as HTMLElement).classList.toggle('drop', true);
    this.#dragOnTimer = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent('expand', {
        bubbles: true,
        composed: true,
        detail: { indexes: [this.index] }
      }));
    }, 1500);
  }

  #handleDragOnLeave(e: DragEvent) {
    window.clearTimeout(this.#dragOnTimer);
    (e.target as HTMLElement).classList.toggle('drop', false);
  }

  #handleDragBelowEnter(e: DragEvent) {
    this.dispatchEvent(new CustomEvent('itemdropenter', {
      bubbles: true,
      composed: true,
      detail: {
        indexes: [this.index],
        callback: (isValid: boolean) => {
          if (isValid) {
            e.dataTransfer!.dropEffect = 'move';
          }
        }
      }
    }));
    (e.target as HTMLElement).classList.toggle('drop', true);
  }

  #handleDragBelowLeave(e: DragEvent) {
    (e.target as HTMLElement).classList.toggle('drop', false);
  }

  #handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  #handleDragAbove(e: DragEvent) {
    (e.target as HTMLElement).classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index], position: 'before' }
    }));
  }

  #handleDropOn(e: DragEvent) {
    (e.target as HTMLElement).classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index], position: 'on' }
    }));
  }

  #handleDropBelow(e: DragEvent) {
    (e.target as HTMLElement).classList.toggle('drop', false);
    this.dispatchEvent(new CustomEvent('move', {
      bubbles: true,
      composed: true,
      detail: { indexes: [this.index], position: 'after' }
    }));
  }

}
