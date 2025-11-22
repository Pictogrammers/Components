import { Component, Prop, Part } from '@pictogrammers/element';

import template from './cardUser.html';
import style from './cardUser.css';

import { addTooltip } from '../tooltip/addTooltip';
import { User } from '../shared/models/user';
import '../card/card';
import '../avatar/avatar';
import PgAvatar from '../avatar/avatar';

@Component({
  selector: 'pg-card-user',
  style,
  template
})
export default class PgCardUser extends HTMLElement {
  @Prop() user: User | null = null;

  @Part() $loading: HTMLDivElement;
  @Part() $user: HTMLDivElement;
  @Part() $name: HTMLDivElement;
  @Part() $github: HTMLAnchorElement;
  @Part() $iconCountValue: HTMLDivElement;
  @Part() $avatar: PgAvatar;

  connectedCallback() {
    addTooltip(this.$github, () => {
      return `View ${this.user?.github} on GitHub`;
    });
  }

  render(changes) {
    if (changes.user && this.user) {
      this.$avatar.user = this.user;
      this.$name.innerText = `${this.user.name}`;
      this.$iconCountValue.innerText = `${this.user.iconCount}`;
      this.$github.href = `https://github.com/${this.user.github}`;
      this.$github.style.setProperty('display', this.user.github ? null : 'none');
      this.$user.style.setProperty('display', null);
      this.$loading.style.setProperty('display', 'none');
    } else {
      this.$user.style.setProperty('display', 'none');
      this.$loading.style.setProperty('display', null);
    }
  }
}