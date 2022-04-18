// This script is super ugly

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
  eachComponent
} = require('./utils');
const { execSync } = require("child_process");

// publish/
// - dist/
// - @types/
// - namespaces/
// - package.json
// - README.md

// Make publish folder
folder('publish');
// Copy README.md to publish/README.md
copyFileSync('README.md', 'publish/README.md');
console.log(`Done: "README.md" copied to "publish/README.md`);
copyFolderSync('dist', 'publish');
removeFolder('publish/dist/api');
remove('publish/dist/index.html');
remove('publish/dist/main.js.LICENSE.txt');
// Write publish/package.json
const package = JSON.parse(read('package.json'));
delete package.private;
delete package.devDependencies;
delete package.scripts.publish;
/*
// Already running `npm version patch`
package.version = package.version.replace(/(\d+)$/g, (m, minor) => {
  const next = parseInt(minor, 10) + 1;
  return `${next}`;
});
*/
write('publish/package.json', JSON.stringify(package, null, 4));
console.log(`Done: "package.json" with version "${package.version}"`);
// Copy src/* to publish/*
copyFolderContentsSync('src', 'publish');
// Inject index.ts into every component
eachComponent('publish', ({ cls, namespace, component }) => {
  if (!exists(`publish/${namespace}/${component}/index.ts`)) {
    write(`publish/${namespace}/${component}/index.ts`, [
      `import ${cls} from './${component}';`,
      ``,
      `export default ${cls};`
    ].join('\n'));
  }
});
console.log(`Done: injecting "index.ts" into each component`);
// Cleanup
// Final Message
console.log(`Done! Please run "cd publish" and "npm publish".`);