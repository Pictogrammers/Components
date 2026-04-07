import { Component, Part, Prop } from '@pictogrammers/element';

import template from './popover.html';

const layers: Set<HTMLElement> = new Set();

type OmitByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};

@Component({
  template,
})
export default class PgPopover extends HTMLElement {
  static create<T extends typeof PgPopover>(this: T, props: Partial<OmitByPrefix<Omit<InstanceType<T>, Exclude<keyof PgPopover, 'source'>>, '$'>>): InstanceType<T> {
    var ele = document.createElement(this.name) as InstanceType<T>;
    props && Object.assign(ele, props);
    document.body.appendChild(ele);
    layers.add(ele);
    return ele;
  }

  @Prop() source: HTMLElement | null = null;

  @Part() $popover: PgPopover;

  visible = false;

  hide() {
    this.$popover.hidePopover();
    this.visible = false;
  }

  show() {
    // @ts-ignore
    this.$popover.showPopover({ source: this.source });
    this.visible = true;
  }

  destroy() {
    this.remove();
    layers.delete(this);
  }
}
