import { Component } from '@pictogrammers/element';

const layers: Set<HTMLElement> = new Set();
const promises: Map<HTMLElement, (value: any) => void> = new Map();

@Component()
export default class PgOverlay extends HTMLElement {
  static open(props: any = {}): Promise<any> {
    var ele = document.createElement(this.name);
    Object.assign(ele, props);
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