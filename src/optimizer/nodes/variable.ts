import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { registerPostAction } from '../actions';
import { Scope } from '../scope';

export const consumeNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const newScope = new Scope(identifier);
  const varValue = Expression.consumeNode(newScope, node.right!);

  if (varValue !== undefined) {
    registerPostAction(() => {
      if (parent.next) {
        const symbol = node.table.get(identifier)!;
        if (!symbol.assigned || symbol.data.references === 0) {
          parent.swap(parent.next);
        }
      }
    });
  }
};
