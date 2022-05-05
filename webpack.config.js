const config = require('@pictogrammers/element-webpack');
const { exists } = require('@pictogrammers/element-webpack/utils');

const { createIndex } = require('./scripts/createIndex');

const bold = (text) => '\033[1m' + text + '\033[0m';
const green = (text) => '\x1b[32m' + text + '\x1b[0m';
const red = (text) => '\x1b[31m' + text + '\x1b[0m';

module.exports = config({
  port: 3000,
  dist: 'dist',
  index: (components, args, mode) => {
    return createIndex(components, mode);
  },
  watch: [],
  copy: [
    { from: "api/", to: `api/` }
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
