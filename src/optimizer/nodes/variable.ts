import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';

export const consumeNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const value = Expression.consumeNode(node.right!);

  if (value !== undefined) {
    const nextNode = parent.next;

    if (nextNode) {
      parent.swap(nextNode);
      parent.set(Core.NodeDirection.Next, parent.next);
      return true;
    }
  }

  return false;
};
