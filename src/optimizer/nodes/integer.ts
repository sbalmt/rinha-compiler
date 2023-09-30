import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../core/metadata';
import { convertToNumber, ensureInt32 } from '../../core/data';

export const consumeNode = (node: Core.Node<Metadata>) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: ensureInt32(convertToNumber(node.fragment.data))
  });

  return data.value;
};
