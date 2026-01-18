import { Component, Prop, Part, node } from '@pictogrammers/element';

import template from './modification.html';
import style from './modification.css';

import templateDate from './type/date.html';
import templateNews from './type/news.html';
import templateIconCreated from './type/iconCreated.html';
import templateIconModified from './type/iconModified.html';
import templateIconRenamed from './type/iconRenamed.html';
import templateIconDeleted from './type/iconDeleted.html';
import templateIconAliasCreated from './type/iconAliasCreated.html';
import templateIconAliasDeleted from './type/iconAliasDeleted.html';
import templateIconTagCreated from './type/iconTagCreated.html';
import templateIconTagDeleted from './type/iconTagDeleted.html';
import templateIconDescriptionModified from './type/iconDescriptionModified.html';
import templateIconAuthorModified from './type/iconAuthorModified.html';
import templateIconDeprecated from './type/iconDeprecated.html';

import { Modification } from '../shared/models/modification';
import { list, item } from '../shared/list';
import { ModificationType } from '../shared/enums/modificationType';
import { addTooltip, BOTTOM_END, BOTTOM_START } from '../tooltip';
import { User } from '../shared/models/user';
import { Icon } from '../shared/models/icon';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
const editIcon = 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';

const mapTemplates = {
  [ModificationType.News]: templateNews,
  [ModificationType.IconCreated]: templateIconCreated,
  [ModificationType.IconModified]: templateIconModified,
  [ModificationType.IconRenamed]: templateIconRenamed,
  [ModificationType.IconDeleted]: templateIconDeleted,
  [ModificationType.IconAliasCreated]: templateIconAliasCreated,
  [ModificationType.IconAliasDeleted]: templateIconAliasDeleted,
  [ModificationType.IconTagCreated]: templateIconTagCreated,
  [ModificationType.IconTagDeleted]: templateIconTagDeleted,
  [ModificationType.IconDescriptionModified]: templateIconDescriptionModified,
  [ModificationType.IconAuthorModified]: templateIconAuthorModified,
  [ModificationType.IconDeprecated]: templateIconDeprecated,
  [ModificationType.Date]: templateDate
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function dateToString(date: string) {
  const d = new Date(date);
  const month = months[d.getMonth()];
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
}

function dateToUUID(date: string) {
  const d = new Date(date);
  const month = months[d.getMonth()];
  return `${d.getFullYear()}-${month}-${d.getDate()}`;
}

function itemsInsertDates(modifications) {
  const items: Modification[] = [];
  let unique = '';
  modifications.forEach((m, i) => {
    const date = dateToString(m.date);
    if (unique !== date) {
      items.push(new Modification().from({
        id: `date-${dateToUUID(m.date)}`,
        modificationId: ModificationType.Date,
        text: date,
        user: new User(),
        icon: new Icon()
      } as any));
      unique = date;
    }
    items.push(m);
  });
  return items;
}

@Component({
  selector: 'pg-modification',
  style,
  template
})
export default class PgModification extends HTMLElement {
  @Prop() modifications: Modification[] = [];
  @Prop() edit: boolean = false;
  // Ex: pictogrammers/repo
  @Prop() github: string = '';

  @Part() $items: HTMLDivElement;

  render(changes) {
    if (changes.modifications && this.modifications) {
      list(
        this.$items,
        itemsInsertDates(this.modifications),
        'id',
        (modification: Modification) => {
          if (modification.modificationId in mapTemplates) {
            const n = node<HTMLDivElement>(mapTemplates[modification.modificationId], {
              text: {
                innerText: modification.text
              },
              markdown: {
                text: modification.text
              },
              icon: {
                path: modification.icon && modification.icon.data
              },
              iconName: {
                innerText: modification.icon && modification.icon.name
              },
              iconNameBefore: {
                innerText: modification.iconNameBefore
              },
              iconNameAfter: {
                innerText: modification.iconNameAfter
              },
              iconDescriptionBefore: {
                text: modification.iconDescriptionBefore
              },
              iconDescriptionAfter: {
                text: modification.iconDescriptionAfter
              },
              iconDataBefore: {
                path: modification.iconDataBefore
              },
              iconDataAfter: {
                path: modification.iconDataAfter
              },
              avatar: {
                user: modification.user as any
              },
              editIcon: {
                path: editIcon
              },
              issue: {
                style: modification.issue ? '' : 'display:none',
                innerText: modification.issue ? `#${modification.issue}` : '',
                href: `https://github.com/${this.github}/issues/${modification.issue}`
              }
            });
            const issue = n.querySelector('[part="issue"]');
            if (issue) {
              addTooltip(issue, () => {
                return `View on GitHub`;
              }, BOTTOM_END);
            }
            const avatar = n.querySelector('[part="avatar"]');
            if (avatar) {
              addTooltip(avatar, () => {
                return modification.user.name;
              }, BOTTOM_START);
            }
            const edit = n.querySelector('[part="edit"]');
            if (edit) {
              edit.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('edit', {
                  detail: {
                    modification
                  }
                }));
              });
            }
            return n;
          }
          const invalid = document.createElement('div');
          invalid.classList.add('invalid');
          invalid.innerText = `Error: Unsupported modificationId with text: "${modification.text}"`;
          return invalid;
        },
        (modifiction, $item) => {

        }
      );
    }
    if (changes.edit) {
      this.$items.classList.toggle('edit', this.edit);
    }
  }

  addItem(modification: Modification) {
    const div = document.createElement('div');

    this.$items.appendChild(div);
  }
}