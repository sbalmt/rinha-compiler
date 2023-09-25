import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const newScope = new Scope(identifier);

  Expression.consumeNode(newScope, node.right!);
};
