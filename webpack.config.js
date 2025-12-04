import config from '@pictogrammers/element-webpack';

import { copyFile } from 'fs';

import createIndex from './scripts/createIndex.js';

const bold = (text) => '\x1b[1m' + text + '\x1b[0m';
const green = (text) => '\x1b[32m' + text + '\x1b[0m';
const red = (text) => '\x1b[31m' + text + '\x1b[0m';

export default config({
  port: 3000,
  dist: 'dist',
  index: (components, args, mode) => {
    return createIndex(components, mode);
  },
  watch: [],
  copy: [
    { from: "api/", to: `api/` },
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
  update: (files) => {
    files.forEach((file) => {
      if (file.startsWith('src')) {
        // copy src -> dist
        copyFile(file, file.replace(/^src/, 'publish'), () => {
          console.log('Copied', file);
        });
      }
    });
    console.log(files);
  },
  after: (components, args, mode) => {
    // Nothing
  }
});
