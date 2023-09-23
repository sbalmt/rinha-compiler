import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { convertToNumber, ensureInt32 } from '../../core/converters';

export const consumeNode = (node: Core.Node<Metadata>): number => {
  const value = ensureInt32(convertToNumber(node.fragment.data));

  node.assign({
    value
  });

  return value;
};
