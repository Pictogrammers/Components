# `<pg-markdown>`

The `pg-markdown` component allows a standard way to render markdown files and apply customizations. Built in customizations include:

- `import: /path/to/file.md` - Import files
- `yaml` - JSON Previewer for all yaml code blocks
  - `$ref: '#/api/model/user'` import complex models.
- Tabsets - Organize complex pages into tabs
- `> **Note:** Blockquote` - Special styling.
  - `note` - Sticky Note
  - `warning` - Pastel Orange
  - `alert`, `error`, `danger` - Pastel Red
  - `good`, `success` - Pastel Green
  - `information`, `attention` - Pastel Blue

```typescript
import '@pictogrammers/components/pg/markdown';
import PgMarkdown, {
  MarkdownReplace
} from '@pictogrammers/components/pg/markdown';
```

```html
<pg-markdown text="# Hello World"></pg-markdown>
<pg-markdown file="/content/file.md"></pg-markdown>
```

## Attributes

| Attributes | Tested   | Description |
| ---------- | -------- | ----------- |
| file       | &#x2705; | File location to load markdown file |
| text       | &#x2705; | Text to render as markdown |
| replace    | &#x2705; | Apply transforms |

### `file`

The `file` will load the markdown data and place it into the text value. This shorthand sometimes preferred.

### `text`

The `text` can be any valid markdown. This also bakes in rich code highlighting from the PrismJS library.

Only the languages listed below have been imported to reduce file size:

- `html`, `xml`
- `css`, `sass`, `scss`
- `javascript` / `typescript` / `jsx` / `tsx`
- `json`
- `java`
- `yaml`
- `php`
- `bash`

### `replace`

For customizing after a render it is helpful to regex replace some content then perform additional event binding.

An example that uses `find`, `replace`, and `render` is handling anchors in the shadow DOM.

```typescript
const mdiLinkVariant = 'M...Z';

component.replace = [{
  find: new RegExp('<(h[2-6])>([^<]+)</h[2-6]>', 'g'),
  replace: (m1, m2, m3) => {
    let id = m3.toLowerCase().replace(/ /g, '-').replace(/\//, '');
    return `<${m2} data-id="${id}">
              ${m3}
              <a href="${this.url}#${id}" style="display:inline-block;vertical-align:middle;">
                <svg viewBox="0 0 24 24" style="width:18px;height:18px;">
                  <path d="${mdiLinkVariant}" fill="#999" />
                </svg>
              </a>
            </${m2}>`;
  },
  render: (template) {
    // On page load if match scroll to
  }
}]
```

## Events

| Event | Tested   | Description |
| ---------- | -------- | ----------- |
| load       | -        | Everything is rendered. |
| error      | -        | Error processing something. |

## Methods

| Method     | Tested   | Description |
| ---------- | -------- | ----------- |
| modify(callback) | -        | Triggers after |

### `modify(callback)`

To wire up custom logic on the rendered html. The `callback` triggers right before the `load` event. Any updates to `text` (or `file`) will trigger the `callback`.

```javascript
markdown.modify(($content) => {
  // $content is the rendered markdown html
});
```

## Custom Tabsets

The `tabs` syntax is really ugly, but needed something that would work with the existing markdown.

```
tabs
tab Tab Title 1

Anything...

/tab
tab Tab Title 2

Another tab's `content`.

/tab
/tabs
```