import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { NodeTypes, ValueTypes } from '../../core/types';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export type Consumers = {
  expressionConsumer: AstConsumer;
  variableConsumer: AstConsumer;
  conditionConsumer: AstConsumer;
};

const wasNodeReplaced = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.previousNode.get(scope.previousDirection) !== node;
};

function* consumeInnerNode(scope: Scope, node: Core.Node<Metadata>, consumers: Consumers): ValueTypes {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope);
  const result = yield consumeNodes(innerScope, innerScope.currentNode, consumers);
  scope.pending = innerScope.pending;
  return result;
}

export function* consumeNodes(scope: Scope, node: Core.Node<Metadata>, consumers: Consumers): ValueTypes {
  let result;

  while (node) {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        result = yield consumers.expressionConsumer(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        result = yield consumers.variableConsumer(scope, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        result = yield consumers.conditionConsumer(scope, node.right!);
        break;

      case NodeTypes.BLOCK:
        result = yield consumeInnerNode(scope, node, consumers);
        break;

      default:
        throw `Unable to optimize block node type (${node.value}).`;
    }

    if (wasNodeReplaced(scope, node)) {
      node = scope.previousNode.get(scope.previousDirection)!;
    } else {
      node = node.next!;
      scope.previousDirection = Core.NodeDirection.Next;
      scope.previousNode = scope.currentNode;
    }

    scope.currentNode = node;
  }

  return result;
}
