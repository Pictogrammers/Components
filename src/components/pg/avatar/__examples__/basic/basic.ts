import { Component, Part, Prop } from '@pictogrammers/element';
import PgAvatar from '../../avatar';
import PgTooltip from '../../../tooltip';
import { AVATAR } from './constants';
import { User } from '../../../shared/models/user';

import template from './basic.html';

@Component({
  selector: 'x-pg-avatar-basic',
  template
})
export default class XPgAvatarBasic extends HTMLElement {

  @Part() $tooltip: PgTooltip;
  @Part() $avatar1: PgAvatar;
  @Part() $avatar2: PgAvatar;

  connectedCallback() {
    this.$avatar1.user = new User().from({
      base64: AVATAR
    } as any);

    this.$avatar2.user = new User().from({
      base64: AVATAR,
      sponsored: true,
      github: 'Templarian',
      name: 'Austin Andrews'
    } as any);
    this.addEventListener('tooltip', this.handleTooltip.bind(this));
  }

  handleTooltip(e) {
    const { visible, rect, text, position } = e.detail;
    this.$tooltip.visible = visible;
    if (visible) {
      this.$tooltip.rect = rect;
      this.$tooltip.text = text;
      this.$tooltip.position = position;
    }
    e.stopPropagation();
  }
}