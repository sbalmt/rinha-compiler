import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { LogList, NodeType } from '../core/types';
import { iterateAllOver } from '../core/processor';
import { printNodes } from '../utils/nodes';
import { Scope, ScopeOptions } from './scope';

export const consumeNodes = (node: NodeType, options?: ScopeOptions): LogList => {
  const globalScope = new Scope(node, Core.NodeDirection.Next, undefined, options);

  while (node.next && globalScope.logs.length === 0) {
    const scope = new Scope(node, Core.NodeDirection.Next, globalScope);
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

  return globalScope.logs;
};
