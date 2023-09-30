import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import { Metadata, initNode, initSymbol } from '../../core/metadata';
import { ErrorTypes, SymbolTypes } from '../../core/types';
import { Scope } from '../scope';

const canBeHoisted = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.value === SymbolTypes.Identifier;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableHoisting } = scope.options;

  const table = scope.isMatchingDeclaration(node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  initSymbol(symbol, {
    hoist: canBeHoisted(symbol)
  });

  initNode(node, {
    symbol
  });

  if (symbol.data.hoist && !enableHoisting) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_REFERENCE, node.fragment);
  }

  symbol.data.references++;

  return node;
};
