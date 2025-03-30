import { Component } from '@pictogrammers/element';

const layers: any[] = [];
const promises: any[] = [];

@Component()
export default class PgOverlay extends HTMLElement {
  static open(props: any = {}): Promise<any> {
    var ele = document.createElement(this.name);
    Object.assign(ele, props);
    document.body.appendChild(ele);
    layers.push(ele);
    return new Promise((resolve) => {
      promises.push(resolve);
    });
  }

  close(result?: any) {
    layers.pop().remove();
    promises.pop()(result);
  }
}