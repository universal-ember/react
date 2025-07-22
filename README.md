# @universal-ember/react

React integration for Ember with reactive updating.

✨ Easy to use
🎉 Supports all props / arguments
⌚ Fast (no effects!)

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

A [reactive demo](https://limber.glimdown.com/edit?c=JYWwDg9gTgLgBAYQuCA7Apq%2BAzKy4DkAAgOYA2oI6UA9AMbKQZYEDcAUKJLHAN5wwoAQzoBrdABM4AXzi58xcpWo1BI0cFQk2nFD350o6ITHQAlTBOpCARmXQy5eEISIBXVMABu1AM5CyAFp0EBsVIxEYHV1ueH4AFQghXxgkLCFNagAaASSUx3kXAgi6GECYPJhgbABPaIZUfNQIKtq4AF44AAoASg6APlzkmC6AIgB3CHGc3wg4Y18a0Z6OBvzE4d8ABWgYAI64ECFxC1QrYTt0Lo2UtL3MqBX2dhoaOAtI72AYGoBCdjW8BgAAsQg5OnR0GQyF0CBQSMCok92OgAB6xOBWbBCNxkeB0MjJXxwAASULIEAA6tAyFI0aYzsSkChmHF2HA4EQ1GJJHAGB54J0AAwcDlc4Q8qQgsEHOHABFRDjsuCaQxgrAHXoDATA4C%2BAB0-I1AGpOgBGUW5EjkdDxUFUTV9dqDEF6-XSh2dV0Gj3g9qdOUKghwAD8hAkQigomDAC5CPDEdEOQAeUzgQmmfrKjkINxQIxYBx2sFx3i8b3u%2B3oaTSbNwZM3GDbXb7Oscsu-QKBOB2vUq4kAKzc%2BWlcBseHGvmocAA8jYB%2BhSjlmq6tHIhKg6DU4F2a23OWA8GBfO0y3OF6UdWD2r7DXmCzAa3A6zQs3XkzY3DAKqg4GgCcAYinuWuo%2BhA1r2MWVA1v0FQQQ4vrJjQn7fmgWYcimKE-s%2BGEYT8YDoO0oxYWgow4bhf6bhQQFliu1Q1DB%2B6NnA4zfMCcAlGUFTDPR77IV%2BP7ofWqghGAGboFmtZAA&format=gjs&shadowdom=off) -- however this won't start working until react-dom publishes ESM (they publish as CJS right now).


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

## Compatibility

- Ember.js v6.3 or above, not that earlier won't work. But this repo isn't testing prior to 6.3


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
