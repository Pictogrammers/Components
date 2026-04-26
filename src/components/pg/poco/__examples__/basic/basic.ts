import { Component, Part } from '@pictogrammers/element';

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
    // Load testing resources
    this.$poco.setResource('colorBitmap.bmp', 40, 40, (ctx, w, h) => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#000"; ctx.fillRect(4, 4, 32, 32);
      ctx.fillStyle = "#fff"; ctx.fillRect(8, 8, 24, 24);
      ctx.fillStyle = "#000"; ctx.fillRect(12, 12, 16, 16);
      ctx.fillStyle = "#fff"; ctx.fillRect(16, 16, 8, 8);
    });
    this.$poco.setResource('monoBitmap.bmp', 32, 32, (ctx, w, h) => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w / 2, h / 2); ctx.lineTo(w, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w / 2, h / 2); ctx.lineTo(w, h); ctx.stroke();
    });
    this.$poco.setResource('grayBitmap.bmp', 32, 32, (ctx, w, h) => {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
    this.$poco.setResource('circleMask.bmp', 40, 40, (ctx, w, h) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); ctx.fill();
    });
    this.$poco.setResource('patternBitmap.bmp', 30, 30, (ctx, w, h) => {
      const size = 10;
      for (let r = 0; r < h; r += size)
        for (let c = 0; c < w; c += size) {
          ctx.fillStyle = ((r + c) / size % 2 === 0) ? "#000" : "#fff";
          ctx.fillRect(c, r, size, size);
        }
    });
  }

  handleRun() {
    const { poco, Resource: r2, parseBMP, parseBMF } = this.$poco;
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
        Math,
        poco,
        Resource: r2,
        parseBMP,
        parseBMF,
      });
    } catch (e: any) {
      this.$error.textContent = e.message;
      this.$error.style.display = "block";
    }
  }
}
