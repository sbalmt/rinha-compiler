import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { NodeType, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: NodeType) => {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope);
  return Block.consumeNodes(innerScope, innerScope.currentNode);
};

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
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
