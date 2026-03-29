import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputTextarea from '../inputTextarea/inputTextarea';

import template from './inputTextareaAutocomplete.html';
import style from './inputTextareaAutocomplete.css';

function getCursorRowCol(
  textArea: HTMLTextAreaElement
): { row: number; col: number } {
  // Get the character index of the cursor
  const cursorIndex = textArea.selectionStart;

  // Get the text content up to the cursor position
  const textUpToCursor = textArea.value.substring(0, cursorIndex);

  // Split the text by newline characters to get all lines
  const lines = textUpToCursor.split('\n');

  // The row (line number) is the number of lines (array length).
  // Rows are typically 1-indexed, so we can return the length directly.
  const row = lines.length - 1;

  // The column is the length of the last line in the `lines` array.
  const col = lines[lines.length - 1].length; // +1 to make it 1-indexed

  return { row, col };
}

@Component({
  selector: 'pg-input-textarea-autocomplete',
  style,
  template
})
export default class PgInputTextareaAutocomplete extends PgInputTextarea {

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

  #currentColumn = -1;
  #currentRow = -1;
  handleCursorMove(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    const { row, col: column } = getCursorRowCol(textArea);
    if (this.#currentColumn !== column && this.#currentRow !== row) {
      this.dispatchEvent(new CustomEvent('caret', {
        detail: {
          column,
          row
        }
      }));
    }
    console.log(`Cursor position: Row ${row}, Column ${column}`);
  }
}
