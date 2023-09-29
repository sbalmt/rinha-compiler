import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);

  blockScope.declarationNode = scope.declarationNode;
  blockScope.scopeNode = scope.scopeNode;

  return Block.consumeNodes(blockScope, blockScope.currentNode);
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const conditionNode = node.right!;

  yield Expression.consumeNode(scope, conditionNode.right!);

  const successBlock = conditionNode.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    yield consumeInnerNode(scope, successBlock);
  }

  if (failureBlock && failureBlock.right) {
    yield consumeInnerNode(scope, failureBlock);
  }

  return node;
}
