# Material Design Icons - Website Components

> Note this repo is for the components used in the Material Design Icons website. If you want components for your own project look here:
>
> - [React](https://github.com/Templarian/MaterialDesign-React/)
> - [Web Component](https://github.com/Templarian/MaterialDesign-WebComponent/)

The website is made of many components, view the `src/pg` folder to see the source.

- [View the Components](https://pictogrammers.github.io/@pictogrammers/components/)

## Contribute to this Project

To run the demo application locally use the following NPM commands.

```bash
npm install
npm test
npm start
# npm start [pgButton|pg-button, ...]
```

Open http://localhost:3000 (port could vary)

To build just the components.

```bash
npm run build
```

## Publish

This project does not use the normal `npm publish`. Always run the script to build individual components.

```bash
npm run publish
```

### Web Components

Web Components with a very basic wrapper. The only magic is...

- `@Prop() foo = 'Hello World`;
  - Calls `this.render()` on change.
- `@Part() $foo: HTMLDivElement;` = `<div part="foo"></div>`
  - `this.$part.innerText = 'Hello World!';`
- `@Local('store') foo = Map([['key', true]]);` Shorthand for localStorage.

Learn More: https://github.com/Pictogrammers/Element