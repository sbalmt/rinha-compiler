import * as Core from '@xcheme/core';

import { Metadata, initNode } from '../../../core/metadata';

const parseString = (raw: string): string => {
  return raw.substring(1, raw.length - 1).replace(/(\\[\w\\])/g, (match) => {
    switch (match) {
      case '\\r':
        return '\r';
      case '\\n':
        return '\n';
      case '\\t':
        return '\t';
      default:
        return match[1];
    }
  });
};

export const consumeNode = (node: Core.Node<Metadata>) => {
  const value = parseString(node.fragment.data);

  initNode(node, {
    value
  });

  return value;
};
