import * as Core from '@xcheme/core';

export const Type = 1102;

export const consumeNode = <T extends Core.Types>(node: Core.Node<T>): string => {
  const value = node.fragment.data;

  return value.substring(1, value.length - 1).replace(/(\\[\w\\])/g, (match) => {
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
