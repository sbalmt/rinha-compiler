import * as Core from '@xcheme/core';

import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { iterateAllOver } from '../../core/processor';
import { printNodes } from '../../core/nodes';
import { Scope, ScopeOptions } from '../scope';

export const consumeNodes = (node: Core.Node<Metadata>, options?: ScopeOptions) => {
  const scope = new Scope(node, Core.NodeDirection.Next, undefined, options);

  if (scope.currentNode) {
    const iterable = Block.consumeNodes(scope, scope.currentNode);
    iterateAllOver(iterable);

    if (options?.debug) {
      printNodes(node);
      console.log('');
    }
  }
};
