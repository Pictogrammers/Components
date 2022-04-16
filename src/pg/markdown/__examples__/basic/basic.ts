import { Component, Part, Prop } from '@pictogrammers/element';
import PgMarkdown from '../../markdown';
import { example, icons, mdiAlert, mdiVanish } from './constants';

import template from './basic.html';

@Component({
  selector: 'x-pg-markdown-basic',
  template
})
export default class XPgMarkdownBasic extends HTMLElement {
  @Part() $markdown: PgMarkdown;

  connectedCallback() {
    this.$markdown.replace = [{
      find: new RegExp('(\\\\mdi|mdi|icon):([a-z0-9-]+):?([#a-z0-9-]+)?', 'g'),
      replace: (m, type, icon, color) => {
        if (type == '\\mdi') { return `mdi:${icon}`; }
        if (icon == 'not' || icon == 'before') { return m; }
        const c = color ? ` style="fill:${color}"` : '';
        if (type === 'mdi') {
          return `<a href="icon/${icon}"><svg class="icon" data-type="link" viewBox="0 0 24 24"><path data-icon="${icon}" fill="currentColor" d="${mdiVanish}"${c} /></svg></a>`;
        } else {
          return `<svg class="icon" data-type="icon" viewBox="0 0 24 24"><path data-icon="${icon}" fill="currentColor" d="${mdiVanish}"${c} /></svg>`;
        }
      }
    }, {
      find: new RegExp('<blockquote>([\\\s\\\S]*?)<\\\/blockquote>', 'g'),
      replace: (m) => {
        const matchLabel = m.match(/<blockquote>\r?\n?<p><strong>([\w ]+):</);
        if (matchLabel) {
          const label = matchLabel[1];
          const classLabel = matchLabel[1].trim().toLowerCase().replace(/[ _]/g, '-');
          m = m.replace(new RegExp(`<strong>${label}:</strong> ?`), '');
          m = m.replace(/^<blockquote/, `<blockquote class="${classLabel}"`);
        }
        return m;
      }
    }];

    this.$markdown.text = example;

    this.$markdown.modify(($content) => {
      var paths = $content.querySelectorAll('[data-icon]');
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        path.setAttribute('d', icons[path.dataset.icon] || mdiAlert)
      }
    });
  }
}