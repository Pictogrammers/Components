import { Component, Part, Prop } from '@pictogrammers/element';

import PgPoco from '../../poco';
import { demos } from './examples';

import template from './basic.html';

function extractBody(fn) {
  const src = fn.toString();
  // Strip the "run() {" header and the closing "}"
  const inner = src.replace(/^run\s*\(\s*[^\)]+\)\s*\{/, "").replace(/\}$/, "");
  return dedent(inner);
}

function dedent(str) {
  const lines = str.split("\n");
  const nonEmpty = lines.filter(l => l.trim().length > 0);
  if (!nonEmpty.length) return str.trim();
  const minIndent = Math.min(...nonEmpty.map(l => l.match(/^(\s*)/)[1].length));
  return lines.map(l => l.slice(minIndent)).join("\n").trim();
}

@Component({
  selector: 'x-pg-poco-basic',
  template,
})
export default class XPgPocoBasic extends HTMLElement {
  @Part() $poco: PgPoco;
  @Part() $list: HTMLSelectElement;
  @Part() $code: HTMLTextAreaElement;
  @Part() $run: HTMLButtonElement;
  @Part() $error: HTMLPreElement;

  connectedCallback() {
    demos.forEach((demo: any, index: number) => {
      const newOption = new Option(demo.label, `${index}`);
      this.$list.add(newOption);
    });
    this.$list.addEventListener('change', (e: any) => {
      this.$code.value = extractBody(demos[e.target.value].run);
    });
    this.$poco.height = 400;
    this.$poco.height = 240;
    this.$code.value = extractBody(demos[0].run);
    this.$run.addEventListener('click', this.handleRun.bind(this));
    this.$error.style.display = 'none';
  }

  handleRun() {
    const { poco } = this.$poco;
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
    try {
      safeExec(this.$code.value, {
        console,
        poco,
      });
    } catch (e: any) {
      this.$error.textContent = e.message;
      this.$error.style.display = "block";
    }
  }
}
