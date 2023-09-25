import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { VarValueType } from '../../../evaluator/scope';
import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../scope';

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  let value;

  while (node) {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        value = Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        value = Variable.consumeNode(scope, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        value = Condition.consumeNode(scope, node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }

    node = node.next!;

    scope.previousNode = scope.currentNode;
    scope.previousDirection = Core.NodeDirection.Next;

    scope.currentNode = node;
  }

  return value;
};
