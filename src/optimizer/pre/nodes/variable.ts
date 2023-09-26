import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../../core/metadata';
import { Scope } from '../../scope';
import { VarValueType } from '../../../evaluator/scope';

const isReference = (value: VarValueType<Metadata>): value is Core.SymbolRecord<Metadata> => {
  return value instanceof Core.SymbolRecord;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment)!;
  const data = initSymbol(symbol);

  const previousDeclarationNode = scope.declarationNode;
  scope.declarationNode = node;

  const value = Expression.consumeNode(scope, node.right!);
  scope.declarationNode = previousDeclarationNode;

  if (!isReference(value)) {
    data.literal = value;
  } else {
    data.follow = value;
  }
};
