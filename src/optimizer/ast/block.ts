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

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>, consumers: Consumers) => {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  innerScope.declarationNode = scope.declarationNode;
  return consumeNodes(innerScope, innerScope.currentNode, consumers);
};

export function* consumeNodes(scope: Scope, node: Core.Node<Metadata>, consumers: Consumers): ValueTypes {
  let value;

  while (node) {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        value = yield consumers.expressionConsumer(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        value = yield consumers.variableConsumer(scope, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        value = yield consumers.conditionConsumer(scope, node.right!);
        break;

      case NodeTypes.BLOCK:
        value = yield consumeInnerNode(scope, node, consumers);
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

  return value;
}
