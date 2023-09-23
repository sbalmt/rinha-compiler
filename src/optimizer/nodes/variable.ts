import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { registerPostAction } from '../actions';
import { Scope } from '../scope';

export const consumeNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const newScope = new Scope(identifier);
  const varValue = Expression.consumeNode(newScope, node.right!);
  const nextNode = parent.next;

  if (varValue !== undefined && nextNode) {
    registerPostAction(() => {
      const symbol = node.table.get(identifier)!;
      if (symbol.data.references === 0) {
        parent.swap(nextNode);
        parent.set(Core.NodeDirection.Next, parent.next);
      }
    });
  }
};
