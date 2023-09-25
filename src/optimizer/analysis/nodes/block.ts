import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { VarValueType } from '../../../evaluator/scope';
import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../scope';

const hasNodeReplaced = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.previousNode.get(scope.previousDirection) !== node;
};

const consumeSingleNode = (scope: Scope, node: Core.Node<Metadata>) => {
  switch (node.value) {
    case NodeTypes.EXPRESSION:
      return Expression.consumeNode(scope, node.right!);

    case NodeTypes.VARIABLE:
      return Variable.consumeNode(scope, node.right!);

    case NodeTypes.IF_ELSE:
      return Condition.consumeNode(scope, node.right!);

    default:
      throw `Unexpected block node type (${node.value}).`;
  }
};

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  let value;

  while (node) {
    value = consumeSingleNode(scope, node);

    if (hasNodeReplaced(scope, node)) {
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
