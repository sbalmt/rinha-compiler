import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';

import { Metadata, initSymbol } from '../../../core/metadata';
import { ErrorTypes } from '../../../core/types';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  const data = initSymbol(symbol, {
    hoist: true
  });

  data.references++;

  return symbol;
};
