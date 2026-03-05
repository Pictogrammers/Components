import { Component, Prop, Part, normalizeBoolean, forEach } from '@pictogrammers/element';

import template from './inputRadio.html';
import style from './inputRadio.css';
import PgInputRadioItem from '../inputRadioItem/inputRadioItem';

@Component({
  selector: 'pg-input-radio',
  style,
  template,
})
export default class PgInputRadio extends HTMLElement {
  @Prop() name: string = '';
  @Prop() value: string = '';
  @Prop(normalizeBoolean) readOnly: boolean = false;
  @Prop(normalizeBoolean) disabled: boolean = false;
  @Prop() items: any[] = [];

  @Part() $items: HTMLInputElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: () => PgInputRadioItem,
    });
  }
}
