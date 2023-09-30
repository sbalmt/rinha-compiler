import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { initSymbol } from '../../core/metadata';
import { NodeType, RecordType, ValueTypes } from '../../core/types';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const hoistDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);

  scope.currentNode.set(Core.NodeDirection.Next, scope.anchorNode.get(scope.anchorDirection));
  scope.anchorNode.set(scope.anchorDirection, scope.currentNode);

  scope.anchorDirection = Core.NodeDirection.Next;
  scope.anchorNode = scope.currentNode;
};

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const canRemoveDefinition = (symbol: RecordType) => {
  const { literal, references, mutable } = symbol.data;

  return (literal !== undefined || references <= 0) && !mutable;
};

function* consumeInnerNode(scope: Scope, node: NodeType): ValueTypes {
  const previousDeclarationNode = scope.declarationNode;
  scope.declarationNode = node;

  const result = yield Expression.consumeNode(scope, node.right!);
  scope.declarationNode = previousDeclarationNode;

  return result;
}

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const { enableHoisting, constantPropagation } = scope.options;

  const symbol = node.table.find(node.fragment)!;

  if (!symbol.assigned) {
    const data = initSymbol(symbol);
    const result = yield consumeInnerNode(scope, node);

    if (isLiteral(result)) {
      data.literal = result;
    } else if (result.assigned) {
      data.follow = result.data.symbol;
    }
  } else {
    const data = symbol.data;
    const result = yield consumeInnerNode(scope, node);

    if (constantPropagation && canRemoveDefinition(symbol)) {
      removeDefinition(scope);
    } else {
      if (data.hoist && enableHoisting) {
        hoistDefinition(scope);
        data.hoist = false;
      }

      if (isLiteral(result)) {
        data.literal = result;
      } else if (result.assigned) {
        data.follow = result.data.symbol;
      }
    }
  }

  return node;
}
