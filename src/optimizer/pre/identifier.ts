import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import { Metadata, initNode, initSymbol } from '../../core/metadata';
import { ErrorTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableHoisting } = scope.options;

  const table = scope.isShadowing(node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  initNode(node, {
    symbol
  });

  const data = initSymbol(symbol, {
    hoist: true
  });

  if (data.hoist && !enableHoisting) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_REFERENCE, node.fragment);
  }

  data.references++;

  return node;
};
