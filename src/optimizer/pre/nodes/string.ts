import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../../core/metadata';
import { parseString } from '../../../core/string';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const value = parseString(node.fragment.data);

  initNode(node, {
    value
  });

  return value;
};
