import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Scope, VarValueType } from '../../core/scope';

export const Type = 1105;

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
  const first = Expression.consumeNode(scope, node.right!);
  const second = Expression.consumeNode(scope, node.right!.next!);

  return [first, second];
};
