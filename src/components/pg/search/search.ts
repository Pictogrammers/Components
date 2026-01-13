import { Component, Prop, Part } from '@pictogrammers/element';
import { Icon } from '../shared/models/icon';
import { iconFilter, sanitizeTerm } from '../shared/iconFilter';
import { filter } from '../shared/filter';

import template from './search.html';
import style from './search.css';

interface Item {
  name: string,
  type: string,
  aliases?: string[],
  icon?: string,
  url: string
}

const KEY = {
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft'
};

@Component({
  selector: 'pg-search',
  style,
  template
})
export default class PgSearch extends HTMLElement {
  @Prop() items: Item[] = [];
  @Prop() icons: Icon[] = [];

  @Part() $grid: HTMLDivElement;
  @Part() $menu: HTMLDivElement;
  @Part() $input: HTMLInputElement;
  @Part() $list: HTMLUListElement;
  @Part() $empty: HTMLDivElement;
  @Part() $reqIcon: HTMLAnchorElement;
  @Part() $reqDoc: HTMLAnchorElement;

  isOpen: boolean = false;
  isOver: boolean = false;
  term: string = '';
  keyIndex = -1;
  anchors: HTMLAnchorElement[] = [];

  connectedCallback() {
    this.$input.addEventListener('input', this.handleInput.bind(this));
    this.$input.addEventListener('focus', this.handleFocus.bind(this));
    this.$input.addEventListener('blur', this.handleBlur.bind(this));
    this.addEventListener('keydown', this.keydown.bind(this));
    this.$list.addEventListener('mouseenter', this.handleListEnter.bind(this));
    this.$list.addEventListener('mouseleave', this.handleListLeave.bind(this));
  }

  handleInput(e) {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    this.term = value;
    this.updateList();
  }

  handleFocus() {
    this.keyIndex = -1;
    this.updateList();
    this.isOpen = true;
    this.$menu.style.display = 'block';
    this.$grid.classList.add('active');
  }

  handleBlur() {
    if (!this.isOver) {
      this.isOpen = false;
      this.$menu.style.display = 'none';
      this.$grid.classList.remove('active');
      this.keyIndex -= 1;
    }
  }

  keydown(e: KeyboardEvent) {
    switch(e.key) {
      case KEY.ArrowDown:
        this.keyIndex += 1;
        this.setActive();
        e.preventDefault();
        e.stopPropagation();
      break;
      case KEY.ArrowUp:
        this.keyIndex -= 1;
        this.setActive();
        e.preventDefault();
        e.stopPropagation();
        break;
    }
  }

  setActive() {
    if (this.keyIndex === -2) {
      this.keyIndex = this.anchors.length - 1;
    }
    if (this.keyIndex === this.anchors.length) {
      this.keyIndex = -1;
    }
    if (this.keyIndex === -1) {
      this.$input.focus();
      this.isOver = false;
    } else {
      this.isOver = true;
      this.anchors[this.keyIndex].focus();
    }
  }

  handleListEnter() {
    this.isOver = true;
  }

  handleListLeave() {
    this.isOver = false;
  }

  highlight(text: string) {
    var i = 0;
    var normalized = text;
    const span = document.createElement('span');
    const term = sanitizeTerm(this.term);
    if (this.term === '') {
      span.innerText = text;
      return span;
    }
    while (normalized) {
      var index = normalized.toLowerCase().indexOf(term);
      if (index === -1) {
        const end = document.createElement('span');
        end.innerText = normalized.substr(0, normalized.length);
        span.appendChild(end);
        normalized = '';
      } else {
        if (index > 0) {
          const start = document.createElement('span');
          start.innerText = normalized.substr(0, index);
          span.appendChild(start);
        }
        const strong = document.createElement('strong');
        strong.innerText = normalized.substr(index, term.length);
        span.appendChild(strong);
        normalized = normalized.substr(index + term.length, normalized.length);
      }
    }
    return span;
  }

  clearList() {
    while(this.$list.firstChild){
      this.$list.removeChild(this.$list.firstChild);
    }
    this.anchors = [];
  }

  updateList() {
    this.clearList();
    let empty = false;
    const termRegex = new RegExp(this.term, 'i');
    const filtered = Array.from(
      filter(
        this.items,
        (item: any) => {
          return item.name.match(termRegex)
        },
        5
      )
    );
    filtered.forEach((item, i) => {
      var li = document.createElement('li');
      li.classList.add('item');
      li.classList.toggle('first', i === 0);
      li.classList.toggle('last', i === filtered.length - 1);
      var a = document.createElement('a');
      a.href = item.url;
      var text = this.highlight(item.name);
      a.appendChild(text);
      var type = document.createElement('span');
      type.innerText = item.type;
      type.classList.add('type');
      a.appendChild(type);
      li.appendChild(a);
      this.$list.appendChild(li);
      this.anchors.push(a);
      empty = true;
    });
    if (this.term !== '') {
      const icons = iconFilter(this.icons, this.term, 5);
      if (icons.length) {
        var li = document.createElement('li');
        li.innerText = 'Icons';
        li.classList.add('section');
        this.$list.appendChild(li);
      }
      icons.forEach((icon, i) => {
        var li = document.createElement('li');
        li.classList.add('icon');
        li.classList.toggle('first', i === 0);
        li.classList.toggle('last', i === icons.length - 1);
        var a = document.createElement('a');
        a.href = `/icon/${icon.name}`;
        var additional = icon.aliases.reduce<string[]>((arr, icon) => {
          if (icon.match) {
            arr.push(icon.name || '');
          }
          return arr;
        }, []);
        var aliasText = '';
        if (additional.length) {
          aliasText = ` (${additional.join(', ')})`;
        }
        const text = this.highlight(`${icon.name}${aliasText}`);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.data as string);
        svg.appendChild(path);
        a.appendChild(svg);
        a.appendChild(text);
        li.appendChild(a);
        this.anchors.push(a);
        this.$list.appendChild(li);
      });
      if (icons.length === 5) {
        var li = document.createElement('li');
        li.classList.add('all');
        var a = document.createElement('a');
        a.href = `/icons?search=${this.term}`;
        a.appendChild(document.createTextNode('All results for "'));
        var strong = document.createElement('strong');
        strong.innerText = this.term;
        a.appendChild(strong)
        a.appendChild(document.createTextNode('"'));
        li.appendChild(a);
        this.anchors.push(a);
        this.$list.appendChild(li);
      }
      if (icons.length > 0) {
        empty = true;
      }
    }
    if (!empty) {
      this.anchors.push(this.$reqIcon);
      this.anchors.push(this.$reqDoc);
    }
    this.$empty.classList.toggle('hide', empty);
  }
}