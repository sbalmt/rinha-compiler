import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../../core/metadata';
import { Scope } from '../../scope';
import { VarValueType } from '../../../evaluator/scope';

const isReference = (value: VarValueType<Metadata>): value is Core.SymbolRecord<Metadata> => {
  return value instanceof Core.SymbolRecord;
};

const hoistDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);

  scope.currentNode.set(Core.NodeDirection.Next, scope.anchorNode.get(scope.anchorDirection));
  scope.anchorNode.set(scope.anchorDirection, scope.currentNode);

  scope.anchorDirection = Core.NodeDirection.Next;
  scope.anchorNode = scope.currentNode;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableHoisting } = scope.options;
  const symbol = node.table.find(node.fragment)!;
  const data = initSymbol(symbol);

  const previousDeclarationNode = scope.declarationNode;
  scope.declarationNode = node;

  const value = Expression.consumeNode(scope, node.right!);
  scope.declarationNode = previousDeclarationNode;

  if (isReference(value)) {
    data.follow = value;
  } else {
    data.literal = value;
  }

  if (data.hoist && enableHoisting) {
    hoistDefinition(scope);
  }
};
