import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope, createScope } from '../scope';

export const consumeNode = (scope: Scope, parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const newScope = createScope(identifier, scope);
  const value = Expression.consumeNode(newScope, node.right!);

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
