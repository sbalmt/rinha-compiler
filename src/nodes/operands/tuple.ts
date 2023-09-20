import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarTupleType } from '../../core/scope';

export const Type = 1105;

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarTupleType<Metadata> => {
  if (!node.assigned) {
    const first = Expression.consumeNode(scope, node.right!);
    const second = Expression.consumeNode(scope, node.right!.next!);

    node.assign({
      value: [first, second]
    });
  }

  return node.data.value as VarTupleType<Metadata>;
};
