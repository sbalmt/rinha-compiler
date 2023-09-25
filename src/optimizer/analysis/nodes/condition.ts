import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    const blockScope = new Scope(successBlock, Core.NodeDirection.Right, scope.optimizations);
    Block.consumeNodes(blockScope, blockScope.currentNode);
  }

  if (failureBlock.right) {
    const blockScope = new Scope(failureBlock, Core.NodeDirection.Right, scope.optimizations);
    Block.consumeNodes(blockScope, blockScope.currentNode);
  }

  return undefined;
};
