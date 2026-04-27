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
  @Prop() supressErrors: boolean = false;

  @Part() $canvas: HTMLCanvasElement;

  #poco: MockPoco;
  #trackTimers: Map<number, number> = new Map();

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

  run(script: string) {
    function safeExec(code, globals = {}) {
      const sandbox = new Proxy(globals, {
        has() { return true; },
        get(target, key) {
          if (key in target) return target[key];
          return undefined;
        }
      });

      const fn = new Function("sandbox", `with (sandbox) { ${code} }`);
      return fn.call(sandbox, sandbox);
    }
    // Clear Existing Timers
    this.#trackTimers.forEach((id) => {
      clearTimeout(id);
    });
    this.#trackTimers.clear();
    // Run Script in Isolation
    try {
      safeExec(script, {
        trace: (message) => console.log(message),
        Math,
        poco: this.#poco,
        Resource: MockResource,
        parseBMP: MockParseBMP,
        parseBMF: MockParseBMF,
        Timer: {
          set: (fn, delay, interval = 0) => {
            if (delay <= 0 && interval <= 0) {
              throw new Error('Invalid Timer.set(), delay > 0; interval > 0')
            }
            if (interval === 0) {
                const id = window.setTimeout(() => {
                  this.#trackTimers.delete(id);
                  fn();
                }, delay);
                this.#trackTimers.set(id, id);
                return id;
            } else if (interval === delay) {
              const id = window.setInterval(() => {
                fn();
              }, interval);
              this.#trackTimers.set(id, id);
              return id;
            }
            const id = window.setTimeout(() => {
              const id2 = window.setInterval(() => {
                fn();
              }, interval);
              this.#trackTimers.set(id, id2);
            }, delay);
            this.#trackTimers.set(id, id);
            return id;
          },
          clear: (id) => {
            clearTimeout(this.#trackTimers.get(id));
          }
        },
      });
    } catch (e: any) {
      const { message } = e;
      this.dispatchEvent(new CustomEvent('error', {
        detail: {
          message,
        }
      }));
      if (this.supressErrors) {
        throw e;
      }
    }
  }
}
