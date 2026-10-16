import { Component, Prop, Part, normalizeString } from '@pictogrammers/element';

import template from './divider.html';
import style from './divider.css';

@Component({
  selector: 'pg-partial-divider',
  style,
  template
})
export default class PgPartialDivider extends HTMLElement {

  @Prop(normalizeString) direction: string = 'vertical';
  @Prop(normalizeString) label: string = '';

  @Part() $divider: HTMLButtonElement;
  @Part() $label: HTMLSpanElement;

  connectedCallback() {
    this.$divider.addEventListener('pointerdown', this.#handlePointerDown.bind(this));
  }

  render(changes: any) {
    if (changes.direction) {
      this.classList.toggle('horizontal', this.direction === 'horizontal');
      this.$divider.setAttribute('aria-orientation', this.direction === 'horizontal' ? 'vertical' : 'horizontal');
    }
    if (changes.label) {
      this.$label.textContent = this.label;
      this.$label.classList.toggle('hide', !this.label);
    }
  }

  #handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    this.$divider.setPointerCapture(e.pointerId);
    this.classList.add('dragging');
    this.dispatchEvent(new CustomEvent('dragstart'));

    const handlePointerMove = (ee: PointerEvent) => {
      this.dispatchEvent(new CustomEvent('drag', {
        detail: { dx: ee.clientX - startX, dy: ee.clientY - startY }
      }));
    };
    const handlePointerUp = () => {
      this.$divider.releasePointerCapture(e.pointerId);
      this.$divider.removeEventListener('pointermove', handlePointerMove);
      this.$divider.removeEventListener('pointerup', handlePointerUp);
      this.classList.remove('dragging');
      this.dispatchEvent(new CustomEvent('dragend'));
    };

    this.$divider.addEventListener('pointermove', handlePointerMove);
    this.$divider.addEventListener('pointerup', handlePointerUp);
  }
}
