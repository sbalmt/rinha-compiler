import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const wasNodeReplaced = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.previousNode.get(scope.previousDirection) !== node;
};

function* consumeInnerNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope);
  const result = yield consumeNodes(innerScope, innerScope.currentNode);
  scope.pending = innerScope.pending;
  return result;
}

export function* consumeNodes(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  let result;

  while (node) {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        result = yield Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        result = yield Variable.consumeNode(scope, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        result = yield Condition.consumeNode(scope, node.right!);
        break;

      case NodeTypes.BLOCK:
        result = yield consumeInnerNode(scope, node);
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
