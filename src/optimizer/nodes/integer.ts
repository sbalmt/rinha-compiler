import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>): number => {
  const value = parseInt(node.fragment.data, 10);

  node.assign({
    value
  });

  return value;
};
