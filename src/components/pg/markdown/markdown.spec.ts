import { selectComponent, getProps } from '@pictogrammers/element';

import './markdown';
import PgMarkdown from './markdown';

const PG_MARKDOWN = 'pg-markdown';

describe('pg-markdown', () => {

  beforeEach(() => {
    var c = document.createElement(PG_MARKDOWN);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_MARKDOWN)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_MARKDOWN);
    expect(props.length).toBe(3);
    expect(props).toContain('text');
    expect(props).toContain('file');
    expect(props).toContain('replace');
  });

  it('should be empty', () => {
    const component = selectComponent<PgMarkdown>(PG_MARKDOWN);
    const {
      $content
    } = component;
    expect($content.innerHTML).toEqual('');
  });

  it('should markdown text input', async () => {
    const component = selectComponent<PgMarkdown>(PG_MARKDOWN);
    component.text = '# Hello';
    const {
      $content
    } = component;
    const result = $content.innerHTML.trim(); // '<h1>Hello</h1> '
    await (async () => {
      expect(result).toEqual('<h1>Hello</h1>');
    });
  });

  it('should transform markdown text input', async () => {
    const component = selectComponent<PgMarkdown>(PG_MARKDOWN);
    component.replace = [{
      find: new RegExp('<h1>([^<]*)</h1>', 'g'),
      replace: (m, header) => {
        return `<h1 class="header">${header}</h1>`;
      }
    }]
    component.text = '# Hello';
    const {
      $content
    } = component;
    const result = $content.innerHTML.trim(); // '<h1 class="header">Hello</h1> '
    await (async () => {
      expect(result).toEqual('<h1 class="header">Hello</h1>');
    });
  });

  it('should markdown code block', async () => {
    const component = selectComponent<PgMarkdown>(PG_MARKDOWN);
    component.text = [
      '```',
      'Hello',
      '```'
    ].join('\n');
    const {
      $content
    } = component;
    const result = $content.innerHTML.trim();
    await (async () => {
      expect(result).toEqual('<pre><code>Hello\n</code></pre>');
    });
  });

});
