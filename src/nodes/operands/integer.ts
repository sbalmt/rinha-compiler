import * as Core from '@xcheme/core';

export const Type = 1101;

export const consumeNode = <T extends Core.Types>(node: Core.Node<T>): number => {
  const value = node.fragment.data;

  return parseInt(value, 10);
};
