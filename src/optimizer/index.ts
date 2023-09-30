import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { NodeType } from '../core/types';
import { iterateAllOver } from '../core/processor';
import { printNodes } from '../utils/nodes';
import { Scope, ScopeOptions } from './scope';

export const consumeNodes = (node: NodeType, options?: ScopeOptions) => {
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
