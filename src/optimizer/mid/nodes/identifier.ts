import * as Core from '@xcheme/core';

import { Metadata } from '../../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment)!;
  const { literal } = symbol.data;

  if (literal !== undefined) {
    const identifierNode = symbol.node!;
    const valueNode = identifierNode.right!;

    node.swap(valueNode.clone());
    symbol.data.references--;

    return literal;
  }

  return undefined;
};
