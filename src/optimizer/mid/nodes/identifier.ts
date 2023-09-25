import * as Core from '@xcheme/core';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../../scope';

const canResolveLiteral = (symbol: Core.SymbolRecord<Metadata>) => {
  const { literal, mutable } = symbol.data;
  return literal !== undefined && !mutable;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveReferences } = scope.options;
  const symbol = node.table.find(node.fragment)!;

  if (canResolveLiteral(symbol) && resolveReferences) {
    const identifierNode = symbol.node!;
    const valueNode = identifierNode.right!;

    node.swap(valueNode.clone());
    symbol.data.references--;

    return symbol.data.literal;
  }

  return node;
};
