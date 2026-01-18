import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputTextIcon.html';
import style from './inputTextIcon.css';

import '../inputText/inputText';
import PgInputText from '../inputText/inputText';
import '../icon/icon';
import PgIcon from '../icon/icon';

@Component({
  selector: 'pg-input-text-icon',
  style,
  template
})
export default class PgInputTextIcon extends PgInputText {
  @Prop() path: string = 'M3,3V21H21V3';

  @Part() $icon: PgIcon;

  render(changes) {
    if (changes.path) {
      this.$icon.path = this.path;
    }
  }
}