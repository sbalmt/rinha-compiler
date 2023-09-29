import * as Core from '@xcheme/core';

import * as Variable from '../ast/variable';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const canRemoveDefinition = (symbol: Core.SymbolRecord<Metadata>) => {
  const { literal, references, mutable } = symbol.data;
  return (literal !== undefined || references <= 0) && !mutable;
};

const hoistDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);

  scope.currentNode.set(Core.NodeDirection.Next, scope.anchorNode.get(scope.anchorDirection));
  scope.anchorNode.set(scope.anchorDirection, scope.currentNode);

  scope.anchorDirection = Core.NodeDirection.Next;
  scope.anchorNode = scope.currentNode;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const { enableHoisting, constantFolding, constantPropagation } = scope.options;

  const symbol = node.table.find(node.fragment)!;
  const data = symbol.data;

  if ((constantFolding || constantPropagation) && canRemoveDefinition(symbol)) {
    removeDefinition(scope);
  } else {
    yield Variable.consumeNode(scope, node, Expression.consumeNode);

    if (data.hoist && enableHoisting) {
      hoistDefinition(scope);
    }
  }

  return node;
}
