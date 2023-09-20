import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

export const Type = 1101;

export const consumeNode = (node: Core.Node<Metadata>): number => {
  if (!node.assigned) {
    const value = node.fragment.data;

    node.assign({
      value: parseInt(value, 10)
    });
  }

  return node.data.value as number;
};
