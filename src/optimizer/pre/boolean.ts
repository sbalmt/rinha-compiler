import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: node.fragment.data === 'true'
  });

  return data.value;
};
