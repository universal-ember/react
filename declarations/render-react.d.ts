import type { ComponentLike } from '@glint/template';
import React from 'react';
interface Signature<Props> {
    Args: {
        [propName: string]: unknown;
        props?: Props;
    };
}
export declare function makeRenderable<ReactComponentType extends React.Component<Props, any, any> | React.FunctionComponent<Props>, Props = any>(ReactComponent: ReactComponentType): ComponentLike<Signature<Props>>;
export {};
//# sourceMappingURL=render-react.d.ts.map