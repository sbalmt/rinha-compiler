import * as Core from '@xcheme/core';

export const Type = 1103;

export const consumeNode = <T extends Core.Types>(node: Core.Node<T>): boolean => {
  const value = node.fragment.data;

  return value === 'true';
};
