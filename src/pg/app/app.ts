import { Component, Part, Prop } from '@pictogrammers/element';

import template from './app.html';
import style from './app.css';

@Component({
  selector: 'pg-app',
  style,
  template
})
export default class PgApp extends HTMLElement {
  @Part() $logo: HTMLButtonElement;
  @Part() $home: HTMLDivElement;
  @Part() $side: HTMLDivElement;
  @Part() $resize: HTMLButtonElement;

  connectedCallback() {
    this.$logo.addEventListener('click', this.#handleClick.bind(this));
    this.$resize.addEventListener('pointerdown', this.#handlePointerDown.bind(this));
  }

  #handleClick() {
    this.$logo.classList.toggle('selected');
    this.$home.classList.toggle('hide');
  }

  #handlePointerDown(e: PointerEvent) {
    const { clientX } = e;
    this.$resize.classList.add('dragging');
    const currentWidth = this.$side.getBoundingClientRect().width;
    let currentX = clientX;
    const handlePointerMove = (ee: PointerEvent) => {
      const x = currentX - ee.clientX;
      const width = currentWidth - x;
      this.$side.style.width = `${width}px`;
    }
    const handlePointerUp = () => {
      this.$resize.classList.remove('dragging');
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    }
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }
}