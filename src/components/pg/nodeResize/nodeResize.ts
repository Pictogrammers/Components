import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './nodeResize.html';
import style from './nodeResize.css';
import { drag } from './dragUtil';

@Component({
  selector: 'pg-node-resize',
  style,
  template,
})
export default class PgNodeResize extends HTMLElement {

  @Prop() gridSize: number = 16;

  @Part() $northWest: HTMLDivElement;
  @Part() $north: HTMLDivElement;
  @Part() $northEast: HTMLDivElement;
  @Part() $west: HTMLDivElement;
  @Part() $east: HTMLDivElement;
  @Part() $southWest: HTMLDivElement;
  @Part() $south: HTMLDivElement;
  @Part() $southEast: HTMLDivElement;

  connectedCallback() {
    drag({
      source: this.$northWest,
      gridSize: this.gridSize,
      start: (dx, dy) => {
        console.log(dx, dy);
      },
      move: (dx, dy) => {
        console.log('move', dx, dy);
      },
      snap: (dx, dy) => {
        console.log('snap', dx, dy);
      },
      end: (dx, dy, complete) => {
        console.log(dx, dy, complete);
      },
    });
  }

  render(changes: any) {

  }
}
