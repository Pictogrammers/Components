export const nodeScripts = [{
  "name": "stateGet",
  "description": "Get",
  "editor": null,
  "async": false,
  "args": [
    {
      "key": "key",
      "label": "Key",
      "editor": "Text",
      "value": ""
    }
  ],
  "nodes": [
    {
      "key": "nodes",
      "label": "nodes"
    }
  ]
},
{
  "name": "dialog",
  "description": "Dialog",
  "editor": null,
  "async": true,
  "args": [
    {
      "key": "character",
      "label": "Character",
      "editor": "Character"
    },
    {
      "key": "text",
      "label": "Text",
      "editor": "Text"
    }
  ],
  "nodes": [
    {
      "key": "nodes",
      "label": "nodes"
    }
  ]
},
{
  "name": "dialogChoice",
  "description": "Choices",
  "editor": null,
  "async": false,
  "args": [
    {
      "key": "text",
      "label": "text",
      "editor": null,
      "value": ""
    }
  ],
  "nodes": [
    {
      "key": "nodes",
      "label": "nodes"
    }
  ]
}, {
  "name": "greaterThan",
  "description": "Greater Than",
  "editor": null,
  "async": false,
  "args": [
    {
      "key": "value",
      "label": "Value",
      "editor": "Number",
      "value": 0
    }
  ],
  "nodes": [
    {
      "key": "t",
      "label": "t"
    },
    {
      "key": "f",
      "label": "f"
    }
  ]
}, {
  "name": "lessThan",
  "description": "Less Than",
  "editor": null,
  "async": false,
  "args": [
    {
      "key": "value",
      "label": "Value",
      "editor": "Number",
      "value": 0
    }
  ],
  "nodes": [
    {
      "key": "t",
      "label": "t"
    },
    {
      "key": "f",
      "label": "f"
    }
  ]
}, {
  "name": "stateAdd",
  "description": "Add",
  "editor": null,
  "async": false,
  "args": [
    {
      "key": "value",
      "label": "Value",
      "editor": "Number",
      "value": 0
    }
  ],
  "nodes": [
    {
      "key": "nodes",
      "label": "nodes"
    }
  ]
}];
