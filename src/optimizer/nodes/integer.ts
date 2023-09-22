import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>): number => {
  if (node.assigned) {
    console.log('ASS', node.value, node.fragment.data, node.fragment.location.column.begin);
  }
  const value = parseInt(node.fragment.data, 10);

  node.assign({
    value
  });

  return value;
};
