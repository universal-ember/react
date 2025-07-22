import { precompileTemplate } from '@ember/template-compilation';
import { waitForPromise } from '@ember/test-waiters';
import { setComponentTemplate } from '@ember/component';
import Modifier from 'ember-modifier';
import type { ComponentLike } from '@glint/template';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Component from '@glimmer/component';
import { macroCondition, isTesting } from '@embroider/macros';
import { setOwner, getOwner } from '@ember/owner';

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
      const owner = getOwner(this);
      const props = this.args.props ? { ...this.args.props } : { ...this.args };

      if (owner) {
        setOwner(props, owner);
      }

      return props;
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

    const toRender = React.createElement(component as any, props);
    /**
     * Subsequent re-renders will diff and replace contents as needed.
     */
    if (macroCondition(isTesting())) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (window as any).IS_REACT_ACT_ENVIRONMENT = true;
      act(() => {
        this.#root?.render(toRender);
      });
    } else {
      this.#root.render(toRender);
    }

    /**
     * For ember's test waiter system.
     * We don't know how long a react component will take to render,
     * but it often doesn't finish synchronously.
     *
     * Waiting until the next animation frame before test executions continues.
     */
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
