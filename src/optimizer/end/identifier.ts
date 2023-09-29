import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { SymbolTypes } from '../../core/types';
import { Scope } from '../scope';

const isNotParameter = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.value !== SymbolTypes.Parameter;
};

const canBeUnFolded = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.data.literal !== undefined && !symbol.data.mutable;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const symbol = node.data.symbol!;

  if (canBeUnFolded(symbol) && scope.options.constantFolding) {
    return symbol.data.literal;
  }

  if (isNotParameter(symbol)) {
    return symbol.node;
  }

  return node;
};
