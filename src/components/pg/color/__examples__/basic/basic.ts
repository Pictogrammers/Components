import { Component, Part } from '@pictogrammers/element';
import PgColor from '../../color';

import template from './basic.html';

@Component({
  selector: 'x-pg-color-basic',
  template
})
export default class XPgColorBasic extends HTMLElement {
  @Part() $color1: PgColor;
  @Part() $colorSelected: HTMLSpanElement;
  @Part() $copyButton: HTMLButtonElement;

  private selectedHex = '';

  connectedCallback() {
    this.$color1.addEventListener('select', (e: CustomEvent) => {
      const { rgb, hex } = e.detail;

      this.selectedHex = hex;
      this.$colorSelected.innerText = `${hex} or rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      this.$copyButton.disabled = false;
    });

    this.$copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.selectedHex);

        const original = this.$copyButton.innerText;
        this.$copyButton.innerText = 'Copied!';

        setTimeout(() => {
          this.$copyButton.innerText = original;
        }, 1000);
      } catch (error) {
        console.error('Failed to copy color:', error);

        this.$copyButton.innerText = 'Failed';

        setTimeout(() => {
          this.$copyButton.innerText = 'Copy';
        }, 1000);
      }
    });
  }
}