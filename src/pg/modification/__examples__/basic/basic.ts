import { Component, Part, Prop } from '@pictogrammers/element';
import { Modification } from 'pg/shared/models/modification';
import PgModification from '../../modification';

import template from './basic.html';
import { modifications } from './constants';

@Component({
  selector: 'x-pg-modification-basic',
  template
})
export default class XPgModificationBasic extends HTMLElement {

  @Part() $modification: PgModification;

  @Part() $clear: HTMLButtonElement;
  @Part() $single: HTMLButtonElement;
  @Part() $editToggle: HTMLButtonElement;

  connectedCallback() {
    this.$modification.modifications = modifications;
    this.$modification.addEventListener('edit', (e: CustomEvent) => {
      console.log(e.detail);
    });
    this.$editToggle.addEventListener('click', () => {
      this.$modification.edit = !this.$modification.edit;
    });
    this.$clear.addEventListener('click', () => {
      this.$modification.modifications = [];
    });
    var increment = 0;
    this.$single.addEventListener('click', () => {
      increment++;
      const existing = this.$modification.modifications as any;
      this.$modification.modifications = [...existing, {
          "id": "3e7a0e1b-b355-11e7-bf5c-94188269ec50" + increment,
          "modificationId": "B4DEB3A8-A146-4086-9D7B-B67842A9CCB8",
          "packageId": "38EF63D0-4744-11E4-B3CF-842B2B6CFE1B",
          "iconNameBefore": null,
          "iconNameAfter": null,
          "iconDescriptionBefore": null,
          "iconDescriptionAfter": null,
          "iconDataBefore": null,
          "iconDataAfter": null,
          "text": "Example `"  + increment + `"`,
          "date": "2020-10-20T16:07:15Z",
          "user": {
              "id": "c4ea5584-07e3-11e4-bf19-842b2b6cfe1b",
              "name": "Austin Andrews",
              "github": "templarian",
              "twitter": "Templarian"
          },
          "icon": null,
          "version": {
              "major": 1,
              "minor": 0,
              "patch": 42
          },
          "issue": null
      }];
    });
  }
}