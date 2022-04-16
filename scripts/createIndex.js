const {
  read,
  write,
  exists,
  remove,
  removeFolder,
  folder,
  copyFileSync,
  copyFolderSync,
  copyFolderContentsSync,
  eachComponent,
  dashToCamel,
  camelToDash
} = require('./utils');

// Generate a demo page from index.html

const DIST_DIR = 'dist';

const mdiGithub = 'M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z';
const mdiLink = 'M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z';
const mdiFile = 'M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z';

exports.createIndex = function(components, mode) {
  let index = read('./src/index.html');

  const contentHtml = [];
  const listComponentsHtml = [];
  const listOverlaysHtml = [];
  const listSharedHtml = [];
  components.forEach(({ name, namespace, component, input, examples }) => {
    const data = read(input);
    const m = data.match(/extends (\w+)/);
    const markdown = read(input.replace(/([^\/]+)$/, 'README.md'))
      .replace(/^# [^\r\n]+/, '');
    const type = m === null ? 'Shared' : m[1];
    contentHtml.push(`<h2 id="${name}H2">`);
    contentHtml.push(camelToDash(name));
    contentHtml.push(`<a title="Link to ${camelToDash(name)}" href="#${camelToDash(name)}" id="${camelToDash(name)}">`);
    contentHtml.push(`<svg viewBox="0 0 24 24">`);
    contentHtml.push(`<path fill="currentColor" d="${mdiLink}">`);
    contentHtml.push(`</svg>`);
    contentHtml.push(`</a>`);
    contentHtml.push(`<span class="label">component</span>`);
    contentHtml.push(`<a title="View Code" href="https://github.com/Templarian/MaterialDesign-Components/tree/master/src/${namespace}/${component}" target="_blank">`);
    contentHtml.push(`<svg viewBox="0 0 24 24">`);
    contentHtml.push(`<path fill="currentColor" d="${mdiGithub}">`);
    contentHtml.push(`</svg>`);
    contentHtml.push(`</a>`);
    contentHtml.push(`<button id="${name}Readme">`);
    contentHtml.push(`<svg viewBox="0 0 24 24">`);
    contentHtml.push(`<path fill="currentColor" d="${mdiFile}">`);
    contentHtml.push(`</svg>`);
    contentHtml.push(`</button>`);
    contentHtml.push(`<span class="line"></span>`);
    contentHtml.push('</h2>');
    contentHtml.push(`<div class="markdown" id="${name}Container"></div>`);
    contentHtml.push('<script>');
    contentHtml.push(`markdown("${name}", ${JSON.stringify(markdown)})`);
    contentHtml.push('</script>');
    switch(type) {
      case 'Shared':
        listSharedHtml.push(`<li><a href="#${camelToDash(name)}">`);
        listSharedHtml.push(`${camelToDash(name).replace('pg-', '')}`);
        listSharedHtml.push(`</a></li>`);
        break;
      case 'PgOverlay':
        listOverlaysHtml.push(`<li><a href="#${camelToDash(name)}">`);
        listOverlaysHtml.push(`${camelToDash(name).replace('pg-', '')}`);
        listOverlaysHtml.push(`</a></li>`);
        break;
      default:
        listComponentsHtml.push(`<li><a href="#${camelToDash(name)}">`);
        listComponentsHtml.push(`${camelToDash(name).replace('pg-', '')}`);
        listComponentsHtml.push(`</a></li>`);
    }

    examples.forEach(({ example }) => {
      // ex x-[pgButton]-[basicTest] = x-pg-button-basic-test
      const tag = `x-${camelToDash(name)}-${camelToDash(example)}`;
      contentHtml.push('<section>');
      contentHtml.push(`<h3><span>${example}</span></h3>`);
      contentHtml.push(`<${tag}></${tag}>`);
      contentHtml.push('</section>');
      contentHtml.push('');
    });
  });

  index = index.replace('<!-- [ListComponents] -->', listComponentsHtml.join('\n'));
  index = index.replace('<!-- [ListOverlays] -->', listOverlaysHtml.join('\n'));
  index = index.replace('<!-- [ListShared] -->', listSharedHtml.join('\n'));
  index = index.replace('<!-- [Examples] -->', contentHtml.join('\n'));
  write(`${DIST_DIR}/index.html`, index);
};