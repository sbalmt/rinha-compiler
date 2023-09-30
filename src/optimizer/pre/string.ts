import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../core/metadata';
import { parseString } from '../../core/string';

export const consumeNode = (node: Core.Node<Metadata>) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: parseString(node.fragment.data)
  });

  return data.value;
};
