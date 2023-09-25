import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';

import { Metadata, initSymbol } from '../../../core/metadata';
import { ErrorTypes } from '../../../core/types';
import { Scope } from '../../scope';

const isShadowing = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.declarationNode?.fragment.data === node.fragment.data;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const table = isShadowing(scope, node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  const data = initSymbol(symbol, {
    hoist: true
  });

  data.references++;

  return symbol;
};
