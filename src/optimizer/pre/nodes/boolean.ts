import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const value = node.fragment.data === 'true';

  initNode(node, {
    value
  });

  return value;
};
