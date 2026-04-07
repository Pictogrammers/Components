import { Component, Part } from '@pictogrammers/element';
import PgInputTextareaAutocomplete from '../../inputTextareaAutocomplete';

import template from './basic.html';

const USERS = ['Dipper', 'Mable', 'Grunkle Stan', 'Wendy', 'Soos', 'Gideon', 'Ford', 'McGucket'];
const TAGS = ['Mystery', 'Cipher', 'Paranormal', 'Gravity', 'Falls', 'Conspiracy', 'Gnomes'];

@Component({
  selector: 'x-pg-input-textarea-autocomplete-basic',
  template,
})
export default class XPgInputTextareaBasic extends HTMLElement {

  @Part() $input: PgInputTextareaAutocomplete;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;
  @Part() $value3: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.#handleChange.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
    this.$input.addEventListener('caret', this.#handleCaret.bind(this));

    this.$input.tokens = [
      /@([a-zA-Z]+\w*)?/, // @username
      /#([a-zA-Z]+\w*)?/  // #TagName
    ];
    this.$input.addEventListener('caret', (e: any) => {
      const { matchIndex, matchText, setOptions } = e.detail;
      const query = matchText.slice(1).toLowerCase();
      switch (matchIndex) {
        case 1: // @username
          setOptions(
            USERS
              .filter(u => u.toLowerCase().startsWith(query))
              .map(u => ({ label: u, value: u }))
          );
          break;
        case 2: // #TagName
          setOptions(
            TAGS
              .filter(t => t.toLowerCase().startsWith(query))
              .map(t => ({ label: t, value: t }))
          );
          break;
        default:
          setOptions([]);
      }
    });
  }

  #handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.textContent = value;
  }

  #handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.textContent = value;
  }

  #handleCaret(e: CustomEvent) {
    const { column, row } = e.detail;
    this.$value3.textContent = `${column}, ${row}`;
  }
}
