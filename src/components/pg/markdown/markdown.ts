import { Component, Prop, Part } from '@pictogrammers/element';
import { Remarkable } from 'remarkable';
import * as YAML from 'js-yaml';
import { MarkdownReplace } from './markdownReplace';
import { http } from '../shared/http';

import 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';

const supported = [
  'css',
  'sass',
  'scss',
  'groovy',
  'typescript',
  'javascript',
  'jsx',
  'tsx',
  'java',
  'html',
  'xml',
  'php',
  'bash',
  'json',
  'yaml',
  'markdown'
];

function yamlToggle(e) {
  const button = e.target;
  const parent = button.parentNode;
  const ul = parent.querySelector('ul');
  if (ul.className === 'yaml-hide') {
    ul.className = '';
    button.innerText = '-';
  } else {
    ul.className = 'yaml-hide';
    button.innerText = '+';
  }
}

function yamlTab(e, tab) {
  const button = e.target;
  const parent = button.parentNode;
  const buttons = parent.querySelectorAll('button');
  buttons.forEach(b => b.className = '');
  button.className = 'active';
  const jsonTab = button.parentNode.nextElementSibling;
  const yamlTab = button.parentNode.parentNode.nextElementSibling;
  switch (tab) {
    case 'json':
      jsonTab.className = 'yaml-preview yaml-show';
      yamlTab.className = 'language-yaml yaml-hide';
      break;
    case 'yaml':
      jsonTab.className = 'yaml-preview yaml-hide';
      yamlTab.className = 'language-yaml yaml-show';
      break;
  }
}

declare var Prism: any;

import template from './markdown.html';
import style from './markdown.css';

@Component({
  selector: 'pg-markdown',
  style,
  template
})
export default class PgMarkdown extends HTMLElement {
  @Prop() file = '';
  @Prop() text = '';
  @Prop() replace: MarkdownReplace[] = [];

  @Part() $content: HTMLDivElement;

  modifiers = [
    ($content) => {
      // Wire up code blocks
      const blocks = $content.querySelectorAll('code[class*="language-"]');
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i] as HTMLElement;
        const pre = block.parentNode as HTMLPreElement;
        pre.classList.add(block.classList.value);
        const language = block.classList.value.replace('language-', '');
        if (supported.includes(language)) {
          block.innerHTML = Prism.highlight(block.innerText, Prism.languages[language], language);
        } else if (language !== '' && language !== 'text') {
          console.error(`Markdown contains a codeblock with "${language}" which is not loaded.`);
        }
        pre.addEventListener('scroll', () => {
          if (pre.scrollLeft === 0) {
            pre.style.removeProperty('--pg-markdown-language-display');
          } else {
            pre.style.setProperty('--pg-markdown-language-display', `none`);
          }
        });
      }
    },
    ($content) => {
      // Wire up yaml block preview
      const yamlToggles = $content.querySelectorAll('[data-id="yamlToggle"]');
      for (let i = 0; i < yamlToggles.length; i++) {
        yamlToggles[i].addEventListener('click', (e) => {
          yamlToggle(e);
        });
      }
      const yamlTabJsons = $content.querySelectorAll('[data-id="yamlTabJson"]');
      for (let i = 0; i < yamlTabJsons.length; i++) {
        yamlTabJsons[i].addEventListener('click', (e) => {
          yamlTab(e, 'json');
        });
        yamlTabJsons[i].click();
      }
      const yamlTabYamls = $content.querySelectorAll('[data-id="yamlTabYaml"]');
      for (let i = 0; i < yamlTabYamls.length; i++) {
        yamlTabYamls[i].addEventListener('click', (e) => {
          yamlTab(e, 'yaml');
        });
      }
    },
    ($content) => {
      const allTabs = $content.querySelectorAll('.tabs');
      for (let i = 0; i < allTabs.length; i++) {
        const tab = allTabs[i];
        const tabItems: any[] = [];
        const tabContentItems: any[] = [];
        const tabs = tab.querySelectorAll('.tab-title a');
        const tabContents = tab.querySelectorAll('.tab-content');
        for (let j = 0; j < tabs.length; j++) {
          tabItems.push(tabs[j]);
          tabContentItems.push(tabContents[j]);
        }
        tabItems.forEach((tabItem, ei) => {
          tabItem.addEventListener('click', (e) => {
            tabItems.forEach((tabItem2, index) => {
              const tabLi = tabItem2.parentNode;
              tabLi.classList.toggle('active', ei === index);
            });
            tabContentItems.forEach((tabContent, index) => {
              tabContent.classList.toggle('tab-hide', ei !== index);
            });
            e.preventDefault();
          });
        });
      }
    }
  ] as Function[];

  modify(callback) {
    this.modifiers.push(callback);
  }

  async render(changes) {
    if (changes.file && this.file) {
      this.text = await http.asset(this.file);
    }
    if (changes.text) {
      const md = new Remarkable({
        html: true
      });
      const markdown = await this.loadContent(this.text);
      let html = md.render(markdown);
      this.replace.forEach(o => {
        html = html.replace(o.find, o.replace);
      });
      this.$content.innerHTML = html;
      this.modifiers.forEach(callback => callback(this.$content));
      // Additional Rendering
      this.replace.forEach(o => {
        if (o.render) {
          o.render(this.$content);
        }
      });
      // Dispatch load
      this.dispatchEvent(
        new CustomEvent('load', {
          detail: {
            $content: this.$content
          }
        })
      );
    }
  }

  async loadFile(file) {
    let markdown = await http.asset(file);
    return this.loadContent(markdown);
  }

  async loadContent(markdown) {
    // Import - 2 deep
    markdown = await this.processImports(markdown);
    markdown = await this.processImports(markdown);
    // Remove line returns
    markdown = markdown.replace(/\r/g, '');
    // Process Refs - 3 deep
    markdown = await this.processRefs(markdown);
    markdown = await this.processRefs(markdown);
    markdown = await this.processRefs(markdown);
    // YAML Swagger Docs
    markdown = markdown.replace(
      /```yaml\r?\n([\s\S]*?)\r?\n```/g,
      (m, content) => this.processYaml(m, content)
    );
    markdown = this.tabs(markdown);
    return markdown;
  }

  /**
   * Rewrite tabs...
   *
   * @param markdown
   */
  tabs(markdown: string) {
    var tabset = '';
    return markdown.replace(/tabs ?([^\n]+)?\n([\s\S]+?)\n\/tabs/g, (m, label, tabs) => {
      var i = 0;
      tabset = label ? `<li class="tab-label">${label}</li>` : '';
      var t = tabs.replace(/tab ([^\n]+)\n([\s\S]+?)\n\/tab/g, (m, title, content) => {
        title = title.replace(/^(icon:\w[\w-]*)? ? (.+?) ?(icon:\w.*)?$/, (m, m1, m2, m3) => {
          return `${m1 || ''}<span>${m2 || ''}</span>${m3 || ''}`;
        });
        tabset += [
          i === 0 ? '<li class="tab-title active">' : '<li class="tab-title">',
          '<a href="#" role="tab" aria-selected="true">',
          title,
          '</a>',
          '</li>'
        ].join('\n');
        const tabContent = [
          i === 0 ? '<div class="tab-content">' : '<div class="tab-content tab-hide">',
          `\n${content.trim()}\n`,
          '</div>'
        ].join('\n');
        i++;
        return tabContent;
      });
      return [
        '<div class="tabs">',
        '<ul class="tabset">',
        tabset,
        `</ul>`,
        t,
        '</div>'
      ].join('\n');
    });
  }

  async processImports(markdown) {
    let imports: string[] = [];
    markdown.replace(/import:(.*)/g, (m, m1) => {
      imports.push(m1);
      return m;
    });
    let c: string[] = await Promise.all(imports.map(async (url, i) => await http.asset(url)));
    imports.forEach((url, i) => {
      markdown = markdown.replace(`import:${url}`, c[i]);
    });
    return markdown;
  }

  async processRefs(markdown) {
    let imports: any[] = [];
    let unique = 0;
    markdown = markdown.replace(/([ ]*)\$ref: '#([^']+)'/g, (m, spaces, file) => {
      unique++;
      imports.push({ unique, spaces, file });
      console.log(`${m}-${unique}`);
      return `${m}-${unique}`;
    });
    let c: string[] = await Promise.all(
      imports.map(async (obj) => await http.asset(`/content/${obj.file}.yaml`))
    );
    imports.forEach((obj, i) => {
      const lines = c[i].split(/\r?\n/);
      const content = lines.map((line, i) => {
        return `${i === 0 ? '' : obj.spaces}${line}`
      }).join("\n");
      markdown = markdown.replace(`$ref: '#${obj.file}'-${obj.unique}`, content);
    });
    return markdown;
  }

  processYaml(m, content) {
    let error = ''
    try {
      const json = YAML.load(content) as any;
      if (json.type) {
        const html = [] as any[];
        html.push('<div class="yaml">');
        html.push('<div class="yaml-toolbar">');
        html.push(`<button data-id="yamlTabJson" class="yaml-click">JSON Preview</button>`);
        html.push(`<button data-id="yamlTabYaml" class="">YAML</button>`);
        html.push('</div>');
        html.push('<div class="yaml-preview">');
        html.push('<ul>');
        this.processYamlRecursive(html, json);
        html.push('</ul>');
        html.push('</div>');
        html.push('</div>');
        html.push("\r\n\r\n");
        html.push(m);
        return html.join('');
      }
    } catch (e) {
      error = [
        '<div class="alert alert-danger">',
        '<strong>YAML Error:</strong><br/>',
        e.message,
        '</div>',
        ''
      ].join("") + "\r\n\r\n";
    }
    return `${error}${m}`;
  }

  processYamlRecursive(html, partial, part = '') {
    if (partial.$ref) {
      html.push(`<li><code class="yaml-prop">`);
      html.push(`<code class="yaml-key">${part}</code>: <code class="yaml-error">$ref: '${partial.$ref}'</code> `);
      html.push(`<code class="yaml-example">Too many nested levels</code>`);
      html.push(`</code></li>`);
    } else if (partial.type) {
      switch (partial.type) {
        case 'object':
          const oName = part === '' ? '' : `<code class="yaml-key">${part}</code>: `;
          html.push(`<li><button data-id="yamlToggle">+</button><code>${oName}{</code><ul class="d-none">`);
          for (let part of Object.keys(partial.properties)) {
            this.processYamlRecursive(html, partial.properties[part], part);
          }
          html.push('</ul><code class="yaml-end">}</code></li>');
          break;
        case 'array':
          const aName = part === '' ? '' : `<code class="yaml-key">${part}</code>: `;
          html.push(`<li><button data-id="yamlToggle">+</button><code>${aName}[</code><ul class="d-none">`);
          this.processYamlRecursive(html, partial.items);
          html.push('</ul><code class="yaml-end">]</code></li>');
          break;
        case 'string':
        case 'integer':
        case 'number':
        case 'boolean':
          html.push(`<li><code class="yaml-prop">`);
          html.push(`<code class="yaml-key">${part}</code>`);
          if (partial.auth) {
            html.push(` <svg width="24" height="24" viewBox="0 0 24 24" class="yaml-auth" title="${partial.auth} Access Required"><path d="M12,17C13.1,17 14,16.1 14,15C14,13.89 13.1,13 12,13C10.9,13 10,13.9 10,15C10,16.1 10.9,17 12,17M18,8C19.1,8 20,8.9 20,10V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V10C4,8.89 4.9,8 6,8H7V6C7,3.24 9.24,1 12,1C14.76,1 17,3.24 17,6V8H18M12,3C10.34,3 9,4.34 9,6V8H15V6C15,4.34 13.66,3 12,3Z" /></svg>`);
          }
          html.push(`: `);
          html.push(`<code class="yaml-type">${partial.type}</code>`);

          if (partial.example) {
            html.push(` <code class="yaml-example">${partial.example}</code>`);
          }
          html.push(`</code></li>`);
          break;
        default:
          html.push(`<li><code class="yaml-prop"><code class="yaml-key">${part}</code>: <code class="yaml-error">Error: Invalid type &quot;${partial.type}&quot;.</code></code></li>`);
      }
    } else {
      html.push(`<li><code class="yaml-prop"><code class="yaml-key">${part}</code>: <code class="yaml-error">Error: No type found.</code></code></li>`);
    }
  }
}