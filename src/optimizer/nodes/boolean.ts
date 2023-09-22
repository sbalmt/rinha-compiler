import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>): boolean => {
  const value = node.fragment.data === 'true';

  node.assign({
    value
  });

  return value;
};
