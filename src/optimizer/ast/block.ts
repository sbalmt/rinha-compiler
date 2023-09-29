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

const consumeSingleNode = (scope: Scope, node: Core.Node<Metadata>, consumers: Consumers) => {
  switch (node.value) {
    case NodeTypes.EXPRESSION:
      return consumers.expressionConsumer(scope, node.right!);

    case NodeTypes.VARIABLE:
      consumers.variableConsumer(scope, node.right!);
      break;

    case NodeTypes.IF_ELSE:
      consumers.conditionConsumer(scope, node.right!);
      break;

    case NodeTypes.BLOCK:
      return consumeInnerNode(scope, node, consumers);

    default:
      throw `Unable to optimize block node type (${node.value}).`;
  }

  return undefined;
};

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>, consumers: Consumers): ValueTypes => {
  let value = undefined;

  while (node) {
    value = consumeSingleNode(scope, node, consumers);

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
};
