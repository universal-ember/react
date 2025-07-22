import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

import { makeRenderable } from '#src/index.ts';
import { Greet, GreetMultiple, HelloWorld } from '#react/hello-world.tsx';

module('makeRenderable', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const Hello = makeRenderable(HelloWorld);

    await render(<template><Hello /></template>);

    assert.dom().hasText('hello world');
  });

  test('takes an argument', async function (assert) {
    const Hello = makeRenderable(Greet);

    await render(<template><Hello @who="Ember" /></template>);

    assert.dom().hasText('hello, Ember');
  });

  test('takes multiple arguments', async function (assert) {
    const Hello = makeRenderable(GreetMultiple);

    await render(<template><Hello @greet="Welcome" @who="Ember" /></template>);

    assert.dom().hasText('Welcome, Ember');
  });

  test('takes multiple arguments with incorrect types', async function (assert) {
    const Hello = makeRenderable(GreetMultiple);

    await render(<template><Hello @greet={{2}} @who={{56}} /></template>);

    assert.dom().hasText('2, 56');
  });

  test('takes props object', async function (assert) {
    const Hello = makeRenderable(GreetMultiple);

    await render(
      <template>
        <Hello @props={{Object greet="Welcome" who="Ember"}} />
      </template>,
    );

    assert.dom().hasText('Welcome, Ember');
  });

  test('takes props object with incorrect types', async function (assert) {
    const Hello = makeRenderable(GreetMultiple);

    await render(
      <template><Hello @props={{Object greet=2 who=56}} /></template>,
    );

    assert.dom().hasText('2, 56');
  });
});
