import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../../core/metadata';
import { printNodes } from '../../core/nodes';
import { Scope, ScopeScopeOptions } from '../scope';

export const consumeNodes = (node: Core.Node<Metadata>, options?: ScopeScopeOptions) => {
  const scope = new Scope(node, Core.NodeDirection.Next, options);

  if (scope.currentNode) {
    Block.consumeNodes(scope, scope.currentNode);

    if (options?.debugPreOptimization) {
      printNodes(node);
    }
  }
};
