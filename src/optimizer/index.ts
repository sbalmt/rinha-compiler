import * as Core from '@xcheme/core';

import * as Block from './pre/block';

import { Metadata } from '../core/metadata';
import { printNodes } from '../core/nodes';
import { Scope, ScopeOptions } from './scope';
import { iterateAllOver } from '../core/processor';

export const consumeNodes = (node: Core.Node<Metadata>, options?: ScopeOptions) => {
  while (node.next) {
    const scope = new Scope(node, Core.NodeDirection.Next, undefined, options);
    const iterable = Block.consumeNodes(scope, scope.currentNode);

    iterateAllOver(iterable);

    if (!scope.pending) {
      break;
    }
  }

  if (options?.debug) {
    printNodes(node);
    console.log('');
  }
};
