import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputCheckList.html';
import style from './inputCheckList.css';
import { list, item } from '../shared/list';

const NS_SVG = 'http://www.w3.org/2000/svg';
const PATH_BLANK = 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z';
const PATH_CHECKED = 'M19 19L5 19V5H15V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V11H19';
const PATH_CHECK = 'M7.91 10.08L6.5 11.5L11 16L21 6L19.59 4.58L11 13.17L7.91 10.08Z';

export interface Option {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'pg-input-check-list',
  style,
  template
})
export default class PgInputCheckList extends HTMLElement {
  @Prop() value: string[] = [];
  @Prop() options: Option[] = [];

  @Part() $list: HTMLLIElement;

  connectedCallback() {
  }

  handleClick(option) {
    const checked = this.value.includes(option.value);
    const li = item<HTMLLIElement>(this.$list, option, 'value');
    const button = li.querySelector('button');
    button?.classList.toggle('blank', checked);
    button?.classList.toggle('checked', !checked);
    li.querySelector('[part="path"]')?.setAttribute('d', checked ? PATH_BLANK : PATH_CHECKED);
    if (checked) {
      this.value.splice(this.value.findIndex(v => v === option.value), 1);
    } else {
      this.value.push(option.value);
    }
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value
        }
      })
    );
  }

  render(changes) {
    if (changes.options) {
      /*
      list(
        this.$list,
        this.options,
        'value',
        (option) => {
          const li = document.createElement('li');
          const button = document.createElement('button');
          if (option.disabled === true) {
            button.disabled = true;
          }
          const checked = this.value.includes(option.value);
          button.classList.toggle('checked', checked);
          button.classList.toggle('blank', !checked);
          const svg = document.createElementNS(NS_SVG, 'svg') as SVGElement;
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('part', 'svg');
          const path = document.createElementNS(NS_SVG, 'path') as SVGPathElement;
          path.setAttribute('d', checked ? PATH_CHECKED : PATH_BLANK);
          path.setAttribute('fill', 'currentColor');
          path.setAttribute('part', 'path');
          svg.appendChild(path);
          const check = document.createElementNS(NS_SVG, 'path') as SVGPathElement;
          check.setAttribute('d', PATH_CHECK);
          check.setAttribute('fill', 'currentColor');
          check.setAttribute('part', 'check');
          svg.appendChild(check);
          button.appendChild(svg);
          const span = document.createElement('span');
          span.innerText = option.label;
          button.appendChild(span);
          button.addEventListener('click', (e) => {
            this.handleClick(option);
          });
          li.appendChild(button);
          return li;
        },
        (option, $item) => {
          $item.querySelector('button').innerText = option.label;
        }
      );
      */
    }
    if (changes.value) {
      //const value = [true, 'true'].includes(this.value);
      //this.$path.setAttribute('d', value ? checked : unchecked);
      //this.$button.classList.toggle('blank', !value);
      //this.$button.classList.toggle('checked', value);
    }
  }
}