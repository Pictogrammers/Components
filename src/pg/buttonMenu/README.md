# `<pg-button-menu>`

The `pg-button-toggle` component is essentially just a button with swappable slotted content. Commonly used with icons, but using `span` elements will allow assigning text content.

```typescript
import '@pictogrammers/components/pg/buttonToggle';
import PgButtonToggle from '@pictogrammers/components/pg/buttonToggle';
```

```html
<pg-button-menu part="menu"></pg-button-toggle>
```

| Attribute  | Tested   | Description |
| ---------- | -------- | ----------- |
| menu      |          | block sizing |
| start      |          | Internal Only |
| end        |          | Internal Only |
| center     |          | Internal Only |

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| open       | &#x2705; | Menu open. |
| close      | &#x2705; | Menu close. |

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-button-color` | `#453C4F` | Text color       |
| `--pg-button-background-color` | `#fff` | Background color       |
| `--pg-button-border-color` | `#453C4F`  | Border color       |
| `--pg-button-hover-color` | `#fff`  | `:hover` Text color      |
| `--pg-button-hover-background-color` | `#453C4F`  | `:hover` Background color      |
| `--pg-button-hover-border-color` | `#453C4F`  | `:hover` Border color      |
| `--pg-button-active-color` | `#fff`  | `active` Text color      |
| `--pg-button-active-background-color` | `#453C4F`  | `active` Background color      |
| `--pg-button-active-border-color` | `#453C4F`  | `active` Border color      |

### Slots

Special styling is applied for `pg-icon`.

```html
<pg-button-toggle>
  <pg-icon slot="active" path="M...Z"></pg-icon>
  <pg-icon slot="inactive" path="M...Z"></pg-icon>
</pg-button-toggle>
```