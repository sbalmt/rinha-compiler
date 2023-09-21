import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>): boolean => {
  if (!node.assigned) {
    const value = node.fragment.data;

    node.assign({
      value: value === 'true'
    });
  }

  return node.data.value as boolean;
};
