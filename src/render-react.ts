import { precompileTemplate } from '@ember/template-compilation';
import { waitForPromise } from '@ember/test-waiters';
import { setComponentTemplate } from '@ember/component';
import Modifier from 'ember-modifier';
import type { ComponentLike } from '@glint/template';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from '@glimmer/component';

interface Signature<Props> {
  Args: {
    [propName: string]: unknown;
    props?: Props;
  };
}

export function makeRenderable<
  ReactComponentType extends
    | React.Component<Props, any, any>
    | React.FunctionComponent<Props>,
  Props = any,
>(ReactComponent: ReactComponentType): ComponentLike<Signature<Props>> {
  class ReactRoot extends Component<Signature<Props>> {
    get props() {
      return this.args.props ? { ...this.args.props } : { ...this.args };
    }
  }
  return setComponentTemplate(
    /**
     * We *must* create an element to render in to.
     * react-dom specifically does not allow rendering in to a fragment.
     *
     * https://github.com/facebook/react/issues/25101
     */
    precompileTemplate(`<div {{mount ReactComponent this.props}}></div>`, {
      strictMode: true,
      scope: () => ({ ReactComponent, mount }),
    }),
    ReactRoot,
  ) as ComponentLike<Signature<Props>>;
}

class mount extends Modifier<{
  Args: {
    Positional: [React.Component | React.FC, Record<string, unknown>];
  };
}> {
  #root?: ReturnType<typeof createRoot>;

  modify(
    element: HTMLDivElement,
    [component, props]: [React.Component | React.FC, Record<string, unknown>],
  ) {
    this.#root ||= createRoot(element);

    this.#root.render(React.createElement(component as any, props));

    waitForPromise(
      (async () => {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
      })(),
    );
  }

  willDestroy() {
    this.#root?.unmount();
  }
}
