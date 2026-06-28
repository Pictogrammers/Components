import { Component, Part } from '@pictogrammers/element';
import PgNodes from '../../nodes';

import template from './basic.html';
import PgNodeEditorText from 'components/pg/nodeEditorText/nodeEditorText';
import PgNodeEditorRange from 'components/pg/nodeEditorRange/nodeEditorRange';
import PgNodeEditorNumber from 'components/pg/nodeEditorNumber/nodeEditorNumber';

@Component({
  selector: 'x-pg-nodes-basic',
  template,
})
export default class XPgNodesBasic extends HTMLElement {

  @Part() $script: PgNodes;
  @Part() $log: HTMLPreElement;

  @Part() $debug: HTMLButtonElement;
  @Part() $debugNext: HTMLButtonElement;
  @Part() $play: HTMLButtonElement;
  @Part() $restart: HTMLButtonElement;

  connectedCallback() {
    // Node Editors
    this.$script.editors.push(PgNodeEditorText);
    this.$script.editors.push(PgNodeEditorNumber);
    this.$script.editors.push(PgNodeEditorRange);
    // Node type registry
    this.$script.nodes.push({
      name: 'setState',
      label: 'Set',
      args: [{
        key: 'key',
        label: 'Key',
        editor: 'Text',
        value: '',
      }, {
        key: 'value',
        label: 'Value',
        editor: 'Text',
        value: '',
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ state, then, key, value }: any) => {
        state.set(key, value);
        return then;
      },
    }, {
      name: 'equals',
      label: 'State Equals',
      args: [{
        key: 'key',
        label: 'Key',
        editor: 'Text',
        value: '',
      }, {
        key: 'value',
        label: 'Value',
        editor: 'Text',
        value: '',
      }],
      nodes: [{
        key: 't',
        label: 'True',
      }, {
        key: 'f',
        label: 'False',
      }],
      handler: ({ state, t, f, key, value }: any) => {
        if (state.get(key) === value) {
          return t;
        } else {
          return f;
        }
      },
    }, {
      name: 'lessThan',
      label: 'Less Than',
      args: [{
        key: 'key',
        label: 'Key',
        editor: 'Text',
      }, {
        key: 'value',
        label: 'Value',
        editor: 'Number',
        value: 0,
      }],
      nodes: [{
        key: 't',
        label: 'True',
      }, {
        key: 'f',
        label: 'False',
      }],
      handler: ({ state, t, f, key, value }: any) => {
        if (state.get(key) < value) {
          return t;
        } else {
          return f;
        }
      },
    }, {
      name: 'greaterThan',
      label: 'Greater Than',
      args: [{
        key: 'key',
        label: 'Key',
        editor: 'Text',
        value: '',
      }, {
        key: 'value',
        label: 'Value',
        editor: 'Number',
        value: 0,
      }],
      nodes: [{
        key: 't',
        label: 'True',
      }, {
        key: 'f',
        label: 'False',
      }],
      handler: ({ state, t, f, key, value }: any) => {
        if (state.get(key) > value) {
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
        value: '',
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ then, message }: any) => {
        this.$log.appendChild(document.createTextNode(`${message}\n`));
        return then;
      },
    }, {
      name: 'coin',
      label: 'Coin Flip',
      args: [],
      nodes: [{
        key: 't',
        label: 'True',
      }, {
        key: 'f',
        label: 'False',
      }],
      handler: ({ t, f }: any) => {
        return Math.random() < 0.5 ? t : f;
      },
    }, {
      name: 'random',
      label: 'Random',
      args: [],
      nodes: [{
        key: 'options',
        label: 'Options',
      }],
      handler: ({ state, options }: any) => {
        if (!state.has('random')) {
          state.set('random', []);
          return options;
        }
        const values = state.get('random');
        if (values.length !== options.length) {
          return [];
        }
        function weightedRandom<T extends { weight: string, then: number[] }>(items: T[]): T {
          const totalWeight = items.reduce((sum, item) => sum + Number(item.weight), 0);
          let random = Math.random() * totalWeight;

          for (const item of items) {
            random -= Number(item.weight);
            if (random <= 0) return item;
          }

          return items[items.length - 1]; // fallback
        }
        state.delete('random');
        return weightedRandom(values).then;
      },
    }, {
      name: 'randomOption',
      label: 'Random Option',
      args: [{
        key: 'weight',
        label: 'Weight',
        editor: 'Number',
        value: 1,
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ state, then, node, weight, options }: any) => {
        console.log(node, weight, options);
        if (!state.has('random')) {
          throw new Error('invalid node');
        }
        const values = state.get('random');
        values.push({
          weight: weight ?? 0,
          then,
        });
        return [node];
      },
    });
    // Items
    this.$script.items.push({
      id: 0,
      x: 2,
      y: 2,
      width: 12,
      height: 4,
      args: {
        description: 'Basic example.',
      },
      nodes: {
        then: [1],
      },
    });
    this.$script.items.push({
      id: 1,
      x: 16,
      y: 2,
      node: 'lessThan',
      args: {
        key: 'health',
        value: 5,
      },
      nodes: {
        t: [2],
        f: [3],
      },
    });
    this.$script.items.push({
      id: 2,
      x: 30,
      y: 2,
      node: 'setState',
      args: {
        key: 'health',
        value: '10',
      },
      nodes: {
        then: [4],
      },
    });
    this.$script.items.push({
      id: 3,
      x: 30,
      y: 10,
      node: 'setState',
      args: {
        key: 'health',
        value: '20',
      },
      nodes: {
        then: [4],
      },
    });
    this.$script.items.push({
      id: 4,
      x: 44,
      y: 8,
      node: 'log',
      args: {
        message: "Health increased to ${state.get('health')}",
      },
      nodes: {
        then: [],
      },
    });
    this.$script.addEventListener('change', this.#handleChange.bind(this));
    this.$script.addEventListener('input', this.#handleInput.bind(this));
    this.$debug.addEventListener('click', this.#handleDebug.bind(this));
    this.$debugNext.addEventListener('click', this.#handleDebugNext.bind(this));
    this.$play.addEventListener('click', this.#handlePlay.bind(this));
    this.$restart.addEventListener('click', this.#handleRestart.bind(this));
  }

  #handleChange(_e: CustomEvent) {}

  #handleInput(_e: CustomEvent) {}

  #handleDebug(_e: CustomEvent) {
    this.$script.debug();
  }

  #handleDebugNext(_e: CustomEvent) {
    this.$script.debugNext();
  }

  #handlePlay(_e: CustomEvent) {
    this.$script.play();
  }

  #handleRestart(_e: CustomEvent) {
    this.$script.restart();
  }
}
