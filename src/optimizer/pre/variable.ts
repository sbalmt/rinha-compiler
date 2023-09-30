import * as Core from '@xcheme/core';

import * as Variable from '../ast/variable';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
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

const canRemoveDefinition = (symbol: Core.SymbolRecord<Metadata>) => {
  const { literal, references, mutable } = symbol.data;

  return (literal !== undefined || references <= 0) && !mutable;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const { enableHoisting, constantPropagation } = scope.options;

  const symbol = node.table.find(node.fragment)!;

  if (!symbol.assigned) {
    const data = initSymbol(symbol);
    const result = yield Variable.consumeNode(scope, node, Expression.consumeNode);

    if (isLiteral(result)) {
      data.literal = result;
    } else if (result.assigned) {
      data.follow = result.data.symbol;
    }
  } else {
    const data = symbol.data;
    const result = yield Variable.consumeNode(scope, node, Expression.consumeNode);

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
