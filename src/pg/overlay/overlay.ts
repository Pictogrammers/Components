import { Component } from '@pictogrammers/element';

function camelToDash(str: string): string {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

const layers: any[] = [];
const promises: any[] = [];

@Component()
export default class PgOverlay extends HTMLElement {
  static open(props: any = {}): Promise<any> {
    var ele = document.createElement(camelToDash(this.name));
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