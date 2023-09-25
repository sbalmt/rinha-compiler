import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../../core/metadata';
import { convertToNumber, ensureInt32 } from '../../../core/converters';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const value = ensureInt32(convertToNumber(node.fragment.data));

  initNode(node, {
    value
  });

  return value;
};
