# `<pg-tabs>`

The `pg-tabs` component allows a standard way to render tabs.

```typescript
import '@pictogrammers/components/pg/tabs';
import PgTabs from '@pictogrammers/components/pg/tabs';
```

```html
<pg-tabs>
  <pg-tab label="Tab 1">
    Content 1
  </pg-tab>
  <pg-tab label="Tab 2">
    Content 2
  </pg-tab>
</pg-tabs>
```


| Events     | Description   |
| ---------- | ------------- |
| onselect   | Set path data |


| CSS Variable        | Default   | Description |
| ------------------- | --------- | ----------- |
| `--pg-icon-color`  | `#453C4F` | Color       |
| `--pg-icon-width`  | `1.5rem`  | Width       |
| `--pg-icon-height` | `1.5rem`  | Height      |