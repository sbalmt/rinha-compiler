import * as Core from '@xcheme/core';

export const Type = 1104;

export const consumeNode = <T extends Core.Types>(node: Core.Node<T>): Core.Node<T> => {
  return node;
};
