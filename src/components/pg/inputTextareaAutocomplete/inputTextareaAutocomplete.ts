import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputTextarea from '../inputTextarea/inputTextarea';
import PgOverlayMenu from '../overlayMenu/overlayMenu';

import template from './inputTextareaAutocomplete.html';
import style from './inputTextareaAutocomplete.css';

function getCursorRowCol(
  textArea: HTMLTextAreaElement
): { row: number; col: number } {
  const cursorIndex = textArea.selectionStart;
  const textUpToCursor = textArea.value.substring(0, cursorIndex);
  const lines = textUpToCursor.split('\n');
  const row = lines.length - 1;
  const col = lines[lines.length - 1].length;
  return { row, col };
}

function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): { top: number; left: number; height: number } {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(element);

  [
    'direction', 'boxSizing', 'width', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontSize', 'lineHeight', 'fontFamily',
    'textAlign', 'textTransform', 'textIndent', 'letterSpacing', 'wordSpacing',
  ].forEach(prop => {
    (mirror.style as any)[prop] = (computed as any)[prop];
  });

  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.top = '0';
  mirror.style.left = '0';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflowWrap = 'break-word';

  mirror.textContent = element.value.substring(0, position);

  const span = document.createElement('span');
  span.textContent = '\u200b';
  mirror.appendChild(span);

  document.body.appendChild(mirror);

  const rect = element.getBoundingClientRect();
  const lineHeight = parseInt(computed.lineHeight) || parseInt(computed.fontSize) * 1.2;
  const coords = {
    top: rect.top + span.offsetTop - element.scrollTop + parseInt(computed.borderTopWidth),
    left: rect.left + span.offsetLeft - element.scrollLeft + parseInt(computed.borderLeftWidth),
    height: lineHeight,
  };

  document.body.removeChild(mirror);
  return coords;
}

@Component({
  selector: 'pg-input-textarea-autocomplete',
  style,
  template,
})
export default class PgInputTextareaAutocomplete extends PgInputTextarea {

  @Prop() tokens: RegExp[] = [];

  connectedCallback() {
    super.connectedCallback();

    this.$input.addEventListener('input', this.handleCursorMove.bind(this));
    this.$input.addEventListener('click', this.handleCursorMove.bind(this));
    this.$input.addEventListener('keyup', this.handleCursorMove.bind(this));
  }

  focus() {
    this.$input.focus();
  }

  skipValue = false;

  render(changes) {
    if (changes.value && !this.skipValue) {
      this.$input.value = this.value;
    }
    if (changes.placeholder) {
      this.$input.placeholder = this.placeholder;
    }
    if (changes.readOnly) {
      this.$input.readOnly = this.readOnly;
    }
    this.skipValue = false;
  }

  handleInput(e) {
    e.stopPropagation();
    this.skipValue = true;
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value: e.target.value,
          name: e.name
        }
      })
    );
  }

  handleChange(e) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: e.target.value,
          name: e.name
        }
      })
    );
  }

  #menuOpen = false;
  #activeOverlay: PgOverlayMenu | null = null;
  #ghostElement: HTMLDivElement | null = null;
  #pendingMatchInfo: { row: number; matchStart: number; matchEnd: number; triggerChar: string } | null = null;

  #closeMenu() {
    if (this.#menuOpen && this.#activeOverlay) {
      this.#activeOverlay.close(undefined);
      this.#activeOverlay = null;
      this.#menuOpen = false;
    }
    if (this.#ghostElement) {
      this.#ghostElement.remove();
      this.#ghostElement = null;
    }
  }

  async #openMenu(
    textArea: HTMLTextAreaElement,
    matchStart: number,
    row: number,
    options: { label: string; value: string }[]
  ) {
    if (this.#ghostElement) {
      this.#ghostElement.remove();
    }

    const fullText = textArea.value;
    let lineStartPos = 0;
    const textLines = fullText.split('\n');
    for (let i = 0; i < row; i++) {
      lineStartPos += textLines[i].length + 1;
    }
    const matchAbsStart = lineStartPos + matchStart;

    const coords = getCaretCoordinates(textArea, matchAbsStart);

    const ghost = document.createElement('div');
    ghost.style.cssText = `position:fixed;top:${coords.top}px;left:${coords.left}px;width:1px;height:${coords.height}px;pointer-events:none;`;
    document.body.appendChild(ghost);
    this.#ghostElement = ghost;
    this.#menuOpen = true;

    const prevMenus = new Set(Array.from(document.querySelectorAll('pg-overlay-menu')));
    const promise = PgOverlayMenu.open({
      source: ghost,
      items: options,
    });
    const newEl = Array.from(document.querySelectorAll('pg-overlay-menu')).find(el => !prevMenus.has(el as PgOverlayMenu));
    this.#activeOverlay = (newEl ?? null) as PgOverlayMenu | null;

    const result = await promise;

    ghost.remove();
    if (this.#ghostElement === ghost) this.#ghostElement = null;
    this.#menuOpen = false;
    this.#activeOverlay = null;

    if (result !== undefined) {
      const { item } = result;
      const matchInfo = this.#pendingMatchInfo;
      if (!matchInfo) return;

      const text = textArea.value;
      const lines = text.split('\n');
      let linePos = 0;
      for (let i = 0; i < matchInfo.row; i++) {
        linePos += lines[i].length + 1;
      }
      const absStart = linePos + matchInfo.matchStart;
      const absEnd = linePos + matchInfo.matchEnd;

      const newText = text.substring(0, absStart) + matchInfo.triggerChar + item.value + text.substring(absEnd);
      textArea.value = newText;
      const newCursorPos = absStart + matchInfo.triggerChar.length + String(item.value).length;
      textArea.setSelectionRange(newCursorPos, newCursorPos);

      this.skipValue = true;
      this.value = newText;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: newText, name: this.name }
      }));
    }

    textArea.focus();
  }

  handleCursorMove(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    const { row, col: column } = getCursorRowCol(textArea);

    let matchIndex = 0;
    let matchStart = -1;
    let matchEnd = -1;
    let matchText = '';

    if (this.tokens.length > 0) {
      const lines = textArea.value.split('\n');
      const currentLine = lines[row] || '';

      for (let i = 0; i < this.tokens.length; i++) {
        const regex = new RegExp(this.tokens[i].source, 'g');
        let match: RegExpExecArray | null;
        while ((match = regex.exec(currentLine)) !== null) {
          const start = match.index;
          const end = match.index + match[0].length;
          if (start <= column && column <= end) {
            matchIndex = i + 1;
            matchStart = start;
            matchEnd = end;
            matchText = match[0];
            break;
          }
        }
        if (matchIndex > 0) break;
      }
    }

    let pendingOptions: { label: string; value: string }[] | null = null;
    const setOptions = (options: { label: string; value: string }[]) => {
      pendingOptions = options;
    };

    this.dispatchEvent(new CustomEvent('caret', {
      detail: { column, row, matchIndex, matchText, setOptions }
    }));

    if (!pendingOptions || (pendingOptions as any[]).length === 0) {
      this.#closeMenu();
      return;
    }

    const options = pendingOptions as { label: string; value: string }[];
    this.#pendingMatchInfo = { row, matchStart, matchEnd, triggerChar: matchText[0] ?? '' };

    if (this.#menuOpen && this.#activeOverlay) {
      const menuItems = (this.#activeOverlay as any).$menu.items;
      menuItems.splice(0, menuItems.length, ...options);
    } else if (!this.#menuOpen) {
      this.#openMenu(textArea, matchStart, row, options);
    }
  }
}
