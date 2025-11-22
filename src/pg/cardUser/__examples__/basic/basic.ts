import { Component, Part, Prop } from '@pictogrammers/element';
import PgCardUser from '../../cardUser';
import { AVATAR } from './constants';
import { User } from '../../../shared/models/user';

import template from './basic.html';

@Component({
  selector: 'x-pg-card-user-basic',
  template
})
export default class XPgCardUserBasic extends HTMLElement {

  @Part() $cardUser1: PgCardUser;

  connectedCallback() {
    this.$cardUser1.user = new User().from({
      "id": "c4ea5584-07e3-11e4-bf19-842b2b6cfe1b",
      "name": "Austin Andrews",
      "description": "Hello, I am a developer that gets bored and makes icons, then websites for icons, then more icons. Open Source is pretty awesome.",
      "base64": AVATAR,
      "github": "Templarian",
      "iconCount": 928,
      "website": "http:\/\/templarian.com",
      "sponsored": true,
      "core": true
    } as any);
  }
}