# @universal-ember/react

React integration for Ember with reactive updating.

## Compatibility

- Ember.js v5.8 or above

## Installation

```
pnpm add @universal-ember/react
```

## Usage

Import the react component into an ember component and render it.

```gjs
import { makeRenderable } from '@universal-ember/react';
import { HelloWorld } from './hello-world.tsx';

const Hello = makeRenderable(HelloWorld);

<template>
  <Hello />

  and with props!
  <Hello @greeting="Hola" />

  or with a props-bag
  <Hello @props={{Object greeting="Hola"}} />
</template>
```

Note that react components should be defined using jsx or tsx. Using jsx/tsx syntax in  js/ts is confusing[^and-incorrect] and should be avoided. 

[^and-incorrect]: and incorrect -- the impact of JSX and TSX being supported in JS and TS files without the `x` extension has wreaked tons of havoc on the broader JavaScript ecosystem.

### Accessing the owner

```jsx
import { getOwner } from '@ember/owner';

function MyReactComponent(props) {
  let owner = getOwner(props);
  let store = owner.lookup('service:store');

  return <>
    ... do something with the store ...
  </>;
}

```

## Testing

testing with React components is a bit harder than with native ember components, because react testing doesn't have any sort of test-waiter system.  The test-waiter system is something library-devs use to make testing easier for app developers, so that app develpers never need to worry about `waitUntil`-style timing.

That said, all `@ember/test-helpers` should still work with React subtrees. 
Just the same, `testing-library` works well across both frameworks.

But, in React, it's very important to minimize the number of effects use, preferring data derivation, and only using effects as a last resort.


### Examples


These examples come from this library's own test suite.

```gjs
import { Greet, HelloWorld } from './hello-world.tsx';

module('makeRenderable', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const Hello = makeRenderable(HelloWorld);

    await render(<template><Hello /></template>);

    assert.dom().hasText('hello world');
  });

  test('takes arguments', async function (assert) {
    const Hello = makeRenderable(Greet);

    await render(<template><Hello @who="Ember" /></template>);

    assert.dom().hasText('hello, Ember');
  });
});
```


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
