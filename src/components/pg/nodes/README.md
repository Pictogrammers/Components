# `<pg-nodes>`

The `pg-nodes` component renders an interactive connected node graph.

```typescript
import '@pictogrammers/components/pgNodes';
```

```html
<pg-nodes part="script"></pg-nodes>
```

## Attributes

| Attributes  | Tested   | Description |
| ----------- | -------- | ----------- |
| `items`     |          | Node list |

> Note: All nodes are sized off a `1rem` grid.

## Events

| Events      | Tested   | Description |
| ----------- | -------- | ----------- |
| change      |          | `{ detail: { index, item[, field] }` |
| input       |          | `{ detail: { index, item[, field] }` |
| statechange |          | `{ detail: { nodeId, state }` |

## Methods

| Method | Tested

## CSS Variables

| CSS Variables       | Default   | Description |
| ------------------- | --------- | ----------- |
| n/a   |  |  |


### Editors

```typescript
this.$script.editors.push(PgNodeEditorText);
```

### Nodes

Node types define the argument schema and execution handler for reusable logic blocks.

```typescript
this.$script.nodes.push({
  name: 'setState',
  label: 'Set',
  args: [{
    key: 'key',
    label: 'Key',
    editor: 'Text',
  }, {
    key: 'value',
    label: 'Value',
    editor: 'Text',
  }],
  nodes: [{
    key: 'then',
    label: 'Then',
  }],
  handler: ({ state, nodes, key, value }) => {
    state.set(key, value);
    return nodes;
  },
}, {
  name: 'equals',
  label: 'State Equals',
  args: [{
    key: 'key',
    label: 'Key',
    editor: 'Text',
  }, {
    key: 'value',
    label: 'Value',
    editor: 'Text',
  }],
  nodes: [{
    key: 't',
    label: 'True',
  }, {
    key: 'f',
    label: 'False',
  }],
  handler: ({ state, t, f, key, value }) => {
    if (state.get(key) === value) {
      return t;
    } else {
      return f;
    }
  },
}, {
  name: 'log',
  label: 'Log',
  args: [{
    key: 'message',
    label: 'Message',
    editor: 'Text',
  }],
  nodes: [{
    key: 'then',
    label: 'Then',
  }],
  handler: ({ state, nodes, message }) => {
    console.log(message);
    return nodes;
  },
});
```

### Items

Items are instances of node types positioned on the canvas grid.

```typescript
// Entry node (id 0 is implicitly type 'entry')
this.$script.items.push({
  id: 0,
  x: 2,
  y: 2,
  args: {
    key: 'description',
    value: 'Script description',
  },
  nodes: {
    then: [1]
  }
});
// Script nodes
this.$script.items.push({
  id: 1,
  x: 12,
  y: 2,
  node: 'equals',
  args: {
    key: 'health',
    value: 5,
  },
  nodes: {
    t: [2],
    f: [3],
  }
});
this.$script.items.push({
  id: 2,
  x: 24,
  y: 2,
  node: 'setState',
  args: {
    key: 'health',
    value: 10,
  },
  nodes: {
    then: []
  }
});
this.$script.items.push({
  id: 3,
  x: 24,
  y: 10,
  node: 'setState',
  args: {
    key: 'health',
    value: 20,
  },
  nodes: {
    then: []
  }
});
```
