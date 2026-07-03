import { Component, Part, Local } from '@pictogrammers/element';
import PgNodes from '../../nodes';

import template from './basic.html';
import PgNodeEditorText from 'components/pg/nodeEditorText/nodeEditorText';
import PgNodeEditorRange from 'components/pg/nodeEditorRange/nodeEditorRange';
import PgNodeEditorNumber from 'components/pg/nodeEditorNumber/nodeEditorNumber';
import PgInputSelect from 'components/pg/inputSelect/inputSelect';

@Component({
  selector: 'x-pg-nodes-basic',
  template,
})
export default class XPgNodesBasic extends HTMLElement {

  @Part() $script: PgNodes;
  @Part() $state: HTMLPreElement;
  @Part() $log: HTMLPreElement;

  @Part() $files: PgInputSelect;
  @Part() $save: HTMLButtonElement;
  @Part() $open: HTMLButtonElement;
  @Part() $new: HTMLButtonElement;

  @Part() $debug: HTMLButtonElement;
  @Part() $debugNext: HTMLButtonElement;
  @Part() $play: HTMLButtonElement;
  @Part() $restart: HTMLButtonElement;

  @Local('nodes.basic') store = new Map<string, any>([
    ['list', []]
  ]);

  connectedCallback() {
    this.$script.globals.push([
      'trace',
      (message) => {
        this.$log.appendChild(document.createTextNode(`${message}\n`));
      }
    ]);
    // Node Editors
    this.$script.editors.push(PgNodeEditorText);
    this.$script.editors.push(PgNodeEditorNumber);
    this.$script.editors.push(PgNodeEditorRange);
    // Node type registry
    this.$script.nodes.push({
      name: 'stateGet',
      label: 'Get',
      width: 8,
      args: [{
        key: 'key',
        label: 'Key',
        editor: 'Text',
        value: '',
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ state, then, key }: any) => {
        if (state.has('$state.next')) {
          const next = state.has('$state.next');
          state.delete('$state.next');
          state.delete('$state');
          return next;
        }
        state.set('$state', key);
        return then;
      },
    }, {
      name: 'stateAdd',
      label: 'Add',
      args: [{
        key: 'value',
        label: 'Value',
        editor: 'Number',
        value: 0,
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ state, then, value }: any) => {
        if (!state.has('$state')) {
          throw new Error('Invalid state');
        }
        const key = state.get('$state');
        const current = state.get(key);
        state.set(key, (current ?? 0) + value);
        return then;
      },
    }, {
      name: 'stateSet',
      label: 'Set',
      args: [{
        key: 'value',
        label: 'Value',
        editor: 'Text',
        value: '',
      }],
      nodes: [{
        key: 'then',
        label: 'Then',
      }],
      handler: ({ state, then, value }: any) => {
        if (!state.has('$state')) {
          throw new Error('Missing get before set');
        }
        const key = state.get('$state');
        state.set(key, value);
        return then;
      },
    }, {
      name: 'equals',
      label: 'State Equals',
      args: [{
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
      handler: ({ state, t, f, value }: any) => {
        const key = state.get('$state');
        if (state.get(key) === value) {
          return t;
        } else {
          return f;
        }
      },
    }, {
      name: 'lessThan',
      label: 'Less Than',
      width: 6,
      args: [{
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
        if (parseFloat(state.get(key)) < value) {
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
      node: 'stateSet',
      args: {
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
      node: 'stateSet',
      args: {
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
    this.$script.addEventListener('debug', this.#handleDebug.bind(this));
    this.$script.addEventListener('change', this.#handleChange.bind(this));
    this.$script.addEventListener('input', this.#handleInput.bind(this));
    this.$debug.addEventListener('click', this.#handleButtonDebug.bind(this));
    this.$debugNext.addEventListener('click', this.#handleDebugNext.bind(this));
    this.$play.addEventListener('click', this.#handlePlay.bind(this));
    this.$restart.addEventListener('click', this.#handleRestart.bind(this));
    this.$save.addEventListener('click', this.#handleSave.bind(this));
    this.$open.addEventListener('click', this.#handleOpen.bind(this));
    this.$new.addEventListener('click', this.#handleNew.bind(this));
    this.$files.addEventListener('change', this.#handleFilesChange.bind(this));
    this.#initFiles();
  }

  #handleChange(_e: CustomEvent) {}

  #handleInput(_e: CustomEvent) {}

  #handleButtonDebug(_e: CustomEvent) {
    this.$script.debug();
  }

  #handleDebug(e: any) {
    const { state } = e.detail;
    this.$state.replaceChildren(Array.from(state).map((args: string[]) => {
      return `${args[0]} = ${args[1]}`;
    }).join('\n'));
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

  #initFiles() {
    const list = this.store.get('list');
    list.forEach((value) => {
      const items = JSON.parse(value);
      const { description } = items[0].args;
      this.$files.options.push({
        label: description,
        value: value,
      });
    });
    if (list.length > 0) {
      this.$files.value = list[0];
    }
  }

  #handleSave(e: CustomEvent) {
    const list = this.store.get('list');
    const { description: newDescription } = this.$script.items[0].args;
    // Search for index
    const index = list.findIndex((value) => {
      const items = JSON.parse(value);
      const { description } = items[0].args;
      return newDescription === description;
    });
    if (index === -1) {
      list?.push(this.$script.json);
    } else {
      list[index] = this.$script.json;
    }
    this.store.set('list', list);
    // update list
    if (index === -1) {
      this.$files.options.push({
        label: newDescription,
        value: this.$script.json,
      });
    } else {
      this.$files.options.splice(index, 1, {
        label: newDescription,
        value: this.$script.json,
      });
    }
    // select
    this.$files.value = this.$script.json;
  }

  #handleOpen(e: CustomEvent) {
    this.$script.json = this.$files.value;
  }

  #handleNew(e: CustomEvent) {
    this.$script.json = '[{"id":0,"x":2,"y":2,"width":12,"height":4,"args":{"description":"New script"},"nodes":{"then":[]}}]'
  }

  #handleFilesChange(e: CustomEvent) {
    this.$files.value = e.detail.value;
  }
}
