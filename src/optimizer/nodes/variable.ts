import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const newScope = new Scope(identifier);
  const value = Expression.consumeNode(newScope, node.right!);

  if (value !== undefined) {
    const nextNode = parent.next;
    const symbol = node.table.get(identifier)!;

    if (nextNode && !symbol.assigned) {
      parent.swap(nextNode);
      parent.set(Core.NodeDirection.Next, parent.next);
      return true;
    }
  }

  return false;
};
