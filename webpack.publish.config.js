import config from '@pictogrammers/element-webpack';

import createIndex from './scripts/createIndex.js';

const bold = (text) => '\x1b[1m' + text + '\x1b[0m';
const green = (text) => '\x1b[32m' + text + '\x1b[0m';
const red = (text) => '\x1b[31m' + text + '\x1b[0m';

export default config({
  dist: 'publish',
  mode: 'production',
  index: (components, args, mode) => {
    return createIndex(components, mode);
  },
  watch: [],
  copy: [
    { from: "src/theme-ui3.css", to: `theme-ui3.css` }
  ],
  before: (components, args, mode) => {
    // Components + GreenText(# of Components)
    console.log('Components', bold(green(components.length)));
    const filteredComponents = args;
    if (filteredComponents.length) {
      let exists = [], invalid = [];
      components.forEach(({ name }) => {
        if (filteredComponents.includes(name)) {
          exists.push(name);
        } else {
          invalid.push(name);
        }
      });
      console.log(' +', ...(exists.map(name => green(name))));
      console.log(' -', ...(invalid.map(name => red(name))));
      // Remove invalid components
      for(let i = components.length - 1; i >= 0; i--) {
        if (invalid.includes(components[i].name)) {
          components.splice(i, 1);
        }
      }
    }
  },
  after: (components, args, mode) => {
    // Nothing
  }
});


/*
import path from 'path';
import {
  dashToCamel,
  getComponents,
  write
} from './scripts/utils.js';
import createIndex from './scripts/createIndex.js';

const DIST_DIR = 'dist';

// Lists
const components = getComponents('src');
const inputs = [];

components.forEach(({ input, examples }) => {
  inputs.push(input);
  examples.forEach(({ exampleInput }) => {
    inputs.push(exampleInput);
  });
});
//write(`publish/index.html`, createIndex(components, mode));
export default (env, argv) => {
  const entries = [];
  //const mode = argv.mode === 'production' ? 'production' : 'development';
  const mode = 'production';
  console.log('mode >>>', argv);
  function addEntries(input, name) {
    entries.push({
      mode: mode,
      entry: input,
      module: {
        rules: [
          {
            test: /\.(css|html)$/i,
            use: 'raw-loader',
          },
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: [ '.ts', '.js' ],
      },
      output: {
        filename: `${name}.js`,
        path: path.resolve(import.meta.dirname, DIST_DIR),
      },
      performance: {
        hints: false
      },
    });
  }

  components.forEach(({ input, name }) => {
    addEntries(input, name);
  });
  addEntries(inputs, 'main');
  // Output Basic Runtime
  console.log(`Stats: ${components.length - 1} Components`);
  return entries;
}; */