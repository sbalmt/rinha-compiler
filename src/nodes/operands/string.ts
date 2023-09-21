import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';

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

export const consumeNode = (node: Core.Node<Metadata>): string => {
  if (!node.assigned) {
    const value = node.fragment.data;

    node.assign({
      value: parseString(value)
    });
  }

  return node.data.value as string;
};
