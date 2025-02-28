import { Component, Prop, Part } from '@pictogrammers/element';

import template from './icon.html';
import style from './icon.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-icon',
  style,
  template
})
export default class PgIcon extends HTMLElement {
  @Prop() path: string = noIcon;

  @Part() $svg: SVGSVGElement;
  @Part() $path: SVGPathElement;

  render(changes) {
    if (changes.path) {
      const viewBox = getComputedStyle(this).getPropertyValue('--pg-icon-viewbox');
      this.$svg.setAttribute('viewBox', viewBox || '0 0 24 24');
      if (!this.path) {
        throw new Error('invalid path set on pg-icon');
      }
      this.$path.setAttribute('d', this.path);
    }
  }
}