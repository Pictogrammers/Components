# `<pg-button>`

The `pg-button` component is essentially just a styled button, but it also allows special rendering for `pg-button-group` and `pg-icon`.

```typescript
import '@pictogrammers/components/pg/button';
import PgButton from '@pictogrammers/components/pg/button';
```

```html
<pg-button>Click Me!</pg-button>
```

| Slots       | Tested   | Description |
| ----------- | -------- | ----------- |
| default     | &#x2705; | Button contents. |

| Attribute  | Tested   | Description |
| ---------- | -------- | ----------- |
| block      |          | block sizing |
| active     |          | Depressed visual state. |
| start      |          | Internal Only |
| end        |          | Internal Only |
| center     |          | Internal Only |

| Events     | Tested   | Description |
| ---------- | -------- | ----------- |
| click      | &#x2705; | Standard click. |

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
<pg-button>
  <pg-icon path="M...Z"></pg-icon>
  Hello!
</pg-button>
```