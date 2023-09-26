import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  blockScope.declarationNode = scope.declarationNode;
  Block.consumeNodes(blockScope, blockScope.currentNode);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const conditionNode = node.right!;

  Expression.consumeNode(scope, conditionNode.right!);

  const successBlock = conditionNode.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    consumeInnerNode(scope, successBlock);
  }

  if (failureBlock && failureBlock.right) {
    consumeInnerNode(scope, failureBlock);
  }

  return undefined;
};
