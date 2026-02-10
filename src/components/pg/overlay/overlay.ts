import { Component, Prop } from '@pictogrammers/element';

const layers: Set<HTMLElement> = new Set();
const promises: Map<HTMLElement, (value: any) => void> = new Map();

type OmitByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};

@Component()
export default class PgOverlay extends HTMLElement {
  static open<T extends typeof PgOverlay>(this: T, props: Partial<OmitByPrefix<Omit<InstanceType<T>, keyof PgOverlay>, '$'>>): Promise<any> {
    var ele = document.createElement(this.name);
    props && Object.assign(ele, props);
    document.body.appendChild(ele);
    layers.add(ele);
    return new Promise((resolve) => {
      promises.set(ele, resolve);
    });
  }

  close(result?: any) {
    this.remove();
    layers.delete(this);
    const resolve = promises.get(this);
    if (resolve) {
      resolve(result);
    }
    promises.delete(this);
  }
}