import { Component, Prop, Part } from '@pictogrammers/element';

import { MockBitmap, MockPoco, MockResource, MockParseBMP, MockParseBMF } from './mockPoco';

import template from './poco.html';
import style from './poco.css';
import { FntFont } from '@pictogrammers/fnt/dist/shared';

@Component({
  selector: 'pg-poco',
  style,
  template,
})
export default class PgPoco extends HTMLElement {
  @Prop() width: number = 400;
  @Prop() height: number = 240;

  @Part() $canvas: HTMLCanvasElement;

  #poco: MockPoco;

  connectedCallback() {
    this.$canvas.width = this.width;
    this.$canvas.height = this.height;
    this.$canvas.style.width = `${this.width}px`;
    this.$canvas.style.height = `${this.height}px`;
    this.#poco = new MockPoco(this.$canvas);
  }

  get poco() {
    return this.#poco;
  }

  get Resource() {
    return MockResource;
  }

  get parseBMP() {
    return MockParseBMP;
  }

  get parseBMF() {
    return MockParseBMF;
  }

  setResourceBMP(
    fileName: string,
    buffer: any,
  ) {
    MockResource.setBMP(fileName, MockBitmap.from(buffer));
  }

  setResourceBMPCanvas(
    fileName: string,
    width: number,
    height: number,
    create: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  ) {
    MockResource.setBMP(fileName, MockBitmap.create(width, height, create));
  }

  setResourceBMF(
    fileName: string,
    buffer:  ArrayBuffer | Uint8Array<ArrayBufferLike>,
  ) {
    MockResource.setBMF(fileName, buffer);
  }

  setResourceBMFJSON(
    fileName: string,
    json: FntFont,
  ) {
    MockResource.setBMFJSON(fileName, json);
  }
}
