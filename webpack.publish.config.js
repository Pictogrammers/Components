import path from 'path';
import {
  dashToCamel,
  getComponents
} from './scripts/utils';
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

export default (env, argv) => {
  const entries = [];
  const mode = argv.mode === 'production' ? 'production' : 'development';
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
        path: path.resolve(__dirname, DIST_DIR),
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
};