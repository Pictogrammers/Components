import { Component, Part } from '@pictogrammers/element';

import PgPoco from '../../poco';
import { demos } from './examples';

import template from './basic.html';
import { mockCharmanderBMP, mockMyFont, mockMyFontBMP } from './myFont';

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
      this.$code.value = dedent(demos[e.target.value].run);
    });
    this.$poco.height = 400;
    this.$poco.height = 240;
    this.$code.value = dedent(demos[0].run);
    this.$run.addEventListener('click', this.handleRun.bind(this));
    this.$error.style.display = 'none';
    // Resources
    this.$poco.setResourceBMPCanvas('colorBitmap.bmp', 40, 40, (ctx, w, h) => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#000"; ctx.fillRect(4, 4, 32, 32);
      ctx.fillStyle = "#fff"; ctx.fillRect(8, 8, 24, 24);
      ctx.fillStyle = "#000"; ctx.fillRect(12, 12, 16, 16);
      ctx.fillStyle = "#fff"; ctx.fillRect(16, 16, 8, 8);
    });
    this.$poco.setResourceBMPCanvas('monoBitmap.bmp', 32, 32, (ctx, w, h) => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w / 2, h / 2); ctx.lineTo(w, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w / 2, h / 2); ctx.lineTo(w, h); ctx.stroke();
    });
    this.$poco.setResourceBMPCanvas('grayBitmap.bmp', 32, 32, (ctx, w, h) => {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
    this.$poco.setResourceBMPCanvas('circleMask.bmp', 40, 40, (ctx, w, h) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); ctx.fill();
    });
    this.$poco.setResourceBMPCanvas('patternBitmap.bmp', 30, 30, (ctx, w, h) => {
      const size = 10;
      for (let r = 0; r < h; r += size)
        for (let c = 0; c < w; c += size) {
          ctx.fillStyle = ((r + c) / size % 2 === 0) ? "#000" : "#fff";
          ctx.fillRect(c, r, size, size);
        }
    });
    // Charmander
    this.$poco.setResourceBMP('charmander.png', mockCharmanderBMP);
    // Resources - Font
    this.$poco.setResourceBMP('myFont.png', mockMyFontBMP);
    this.$poco.setResourceBMFJSON('myFont.fnt', mockMyFont);
    // Error handler
    this.$poco.addEventListener('error', (e: any) => {
      this.$error.textContent = e.detail.message;
      this.$error.style.display = "block";
    });
  }

  handleRun() {
    this.$error.style.display = "none";
    this.$poco.run(this.$code.value);
  }
}
