import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { TupleTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const first = Expression.consumeNode(scope, node.right!);
  const second = Expression.consumeNode(scope, node.right!.next!);
  const value = [first, second] as TupleTypes;

  node.set(Core.NodeDirection.Right, undefined);

  initNode(node, {
    value
  });

  return value;
};
