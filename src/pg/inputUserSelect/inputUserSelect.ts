import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputUserSelect.html';
import style from './inputUserSelect.css';
import { User } from '../shared/models/user';
import PgIcon from '../icon/icon';

function createIcon(d: string, className: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);
  svg.classList.add(className);
  return svg;
}

const KEY = {
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  Escape: 'Escape',
  Tab: 'Tab'
};

const mdiGithub = 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z';
const mdiShape = 'M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z';

@Component({
  selector: 'pg-input-user-select',
  style,
  template
})
export default class PgInputUserSelect extends HTMLElement {
  @Prop() options: User[] = [];
  @Prop() value: User | null = null;
  @Prop() clear: boolean = false;
  @Prop() noDataText: string = 'Empty Users List';
  @Prop() noSelectionText: string = 'Select a User';
  @Prop() name: string = '';

  @Part() $select: HTMLButtonElement;
  @Part() $selectedAvatar: HTMLImageElement;
  @Part() $selectedName: HTMLSpanElement;
  @Part() $githubIcon: PgIcon;
  @Part() $selectedGithub: HTMLSpanElement;
  @Part() $countIcon: PgIcon;
  @Part() $selectedCount: HTMLSpanElement;
  @Part() $dropdown: HTMLDivElement;
  @Part() $loading: SVGElement;
  @Part() $loadingText: HTMLSpanElement;
  @Part() $noData: HTMLSpanElement;
  @Part() $noSelection: HTMLSpanElement;

  connectedCallback() {
    this.$select.addEventListener('click', this.handleClick.bind(this));
    this.addEventListener('keydown', this.handleKeys.bind(this));
  }

  isOpen = false;
  handleCloseBind;
  optionsElements: HTMLButtonElement[] = [];

  close() {
    this.isOpen = false;
    this.$dropdown.classList.remove('open');
    document.removeEventListener('mousedown', this.handleCloseBind);
  }

  handleClose(e) {
    // This is wrong
    const target = e.target as PgInputUserSelect;
    if (target.nodeName === this.nodeName && target.isOpen) {
      // Do nothing!
    } else {
      this.close();
    }
  }

  handleClick() {
    this.isOpen = !this.isOpen;
    this.$dropdown.classList.toggle('open', this.isOpen);
    this.handleCloseBind = this.handleClose.bind(this);
    document.addEventListener('mousedown', this.handleCloseBind);
    this.focusSelected();
  }

  focusSelected() {
    const find = this.options?.findIndex((value) => value === this.value);
    if (find && find !== -1) {
      this.optionsElements[find].focus();
      this.index = find;
    } else if (this.optionsElements.length) {
      this.optionsElements[0].focus();
    }
  }

  handleSelect(e) {
    console.log('clicked');
    const { id } = e.currentTarget.dataset;
    const selected = this.options?.find(d => d.id === id);
    this.value = selected || null;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value,
          name: this.name
        }
      })
    );
    this.close();
  }

  loadingMode() {
    this.$selectedAvatar.style.display = 'none';
    this.$selectedName.style.display = 'none';
    this.$githubIcon.style.display = 'none';
    this.$selectedGithub.style.display = 'none';
    this.$countIcon.style.display = 'none';
    this.$selectedCount.style.display = 'none';
    this.$noData.style.display = 'none';
    this.$noSelection.style.display = 'none';
    this.$loading.style.display = 'flex';
    this.$loadingText.style.display = 'initial';
    this.$select.disabled = true;
  }

  noDataMode() {
    this.$selectedAvatar.style.display = 'none';
    this.$selectedName.style.display = 'none';
    this.$githubIcon.style.display = 'none';
    this.$selectedGithub.style.display = 'none';
    this.$countIcon.style.display = 'none';
    this.$selectedCount.style.display = 'none';
    this.$noData.style.display = 'initial';
    this.$noSelection.style.display = 'none';
    this.$loading.style.display = 'none';
    this.$loadingText.style.display = 'none';
    this.$select.disabled = true;
  }

  noSelectionMode() {
    this.$selectedAvatar.style.display = 'none';
    this.$selectedName.style.display = 'none';
    this.$githubIcon.style.display = 'none';
    this.$selectedGithub.style.display = 'none';
    this.$countIcon.style.display = 'none';
    this.$selectedCount.style.display = 'none';
    this.$noData.style.display = 'none';
    this.$noSelection.style.display = 'initial';
    this.$loading.style.display = 'none';
    this.$loadingText.style.display = 'none';
    this.$select.disabled = false;
  }

  selectMode() {
    this.$selectedAvatar.style.display = 'initial';
    this.$selectedName.style.display = 'initial';
    this.$githubIcon.style.display = 'initial';
    this.$selectedGithub.style.display = 'initial';
    this.$countIcon.style.display = 'initial';
    this.$selectedCount.style.display = 'initial';
    this.$noData.style.display = 'none';
    this.$noSelection.style.display = 'none';
    this.$loading.style.display = 'none';
    this.$loadingText.style.display = 'none';
    this.$select.disabled = false;
  }

  render(changes) {
    if (changes.options) {
      if (this.options === null) {
        this.loadingMode();
      } else if (this.options.length === 0) {
        this.noDataMode();
      } else {
        this.selectMode();
        this.calculateMinWidth();
        this.optionsElements = this.options.map(o => {
          const button = document.createElement('button');
          const img = document.createElement('img');
          img.src = `${o.base64}`;
          img.classList.add('avatar');
          button.appendChild(img);
          const spanName = document.createElement('span');
          spanName.innerText = `${o.name}`;
          spanName.classList.add('name');
          button.appendChild(spanName);
          const spanGitHub = document.createElement('span');
          spanGitHub.innerText = `${o.github}`;
          spanGitHub.classList.add('github');
          button.appendChild(spanGitHub);
          const spanIconCount = document.createElement('span');
          spanIconCount.innerText = `${o.iconCount}`;
          spanIconCount.classList.add('iconCount');
          button.appendChild(spanIconCount);
          button.dataset.id = `${o.id}`;
          button.appendChild(createIcon(mdiGithub, 'githubIcon'));
          button.appendChild(createIcon(mdiShape, 'countIcon'));
          button.addEventListener('click', this.handleSelect.bind(this));
          this.$dropdown.appendChild(button);
          return button;
        });
        if (this.value === null) {
          this.noSelectionMode();
        }
      }
      //if (this.$select.value !== this.value) {
      //  this.$select.value = this.value;
      //}
    }
    if (changes.value) {
      if (changes.value && this.value) {
        this.$selectedAvatar.src = this.value.base64 || '';
        this.$selectedCount.innerText = `${this.value.iconCount}`;
        this.$selectedName.innerText = `${this.value.name}`;
        this.$selectedGithub.innerText = `${this.value.github}`;
        this.selectMode();
      }
    }
    if (changes.noDataText) {
      this.$noData.innerText = this.noDataText;
    }
    if (changes.noSelectionText) {
      this.$noSelection.innerText = this.noSelectionText;
    }
  }

  calculateMinWidth() {
    const { width } = this.$select.getBoundingClientRect();
    this.$dropdown.style.minWidth = `${width - 2}px`;
  }

  index = -1;
  handleKeys(e: KeyboardEvent) {
    const items = this.optionsElements;
    let newIndex = this.index;
    switch (e.key) {
      case KEY.ArrowUp:
        if (newIndex === 0) {
          newIndex = items.length - 1;
        } else if (newIndex >= 0) {
          newIndex -= 1;
        }
        break;
      case KEY.ArrowDown:
        if (newIndex < items.length - 1) {
          newIndex += 1;
        } else if (newIndex === items.length - 1) {
          newIndex = 0;
        }
        break;
      case KEY.Tab:
      case KEY.Escape:
          this.close();
          break;
    }
    if (newIndex != this.index) {
      this.index = newIndex;
      items[newIndex].focus();
      e.preventDefault();
    }
  }
}