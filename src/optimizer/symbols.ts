import * as Core from '@xcheme/core';

import * as Errors from '../core/errors';

import { Metadata } from '../core/metadata';
import { ErrorTypes } from '../core/types';
import { Scope } from './scope';

const isShadowing = (scope: Scope, identifier: string) => {
  return scope.name === identifier;
};

const findSymbol = (scope: Scope, table: Core.SymbolTable<Metadata>, identifier: string) => {
  if (isShadowing(scope, identifier)) {
    return table.parent?.find(identifier);
  }

  return table.find(identifier);
};

export const resolveSymbol = (scope: Scope, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const symbol = findSymbol(scope, node.table, identifier);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  if (!symbol.assigned) {
    symbol.assign({
      references: 0
    });
  }

  return symbol;
};
