import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { VarTupleType } from '../../evaluator/scope';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const first = Expression.consumeNode(node.right!);
  const second = Expression.consumeNode(node.right!.next!);
  const value = [first, second] as VarTupleType<Metadata>;

  node.assign({
    value
  });

  return value;
};
