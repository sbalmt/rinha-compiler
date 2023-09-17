import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Scope } from '../../core/scope';

export const enum Types {
  EQUAL = 1203,
  NOT_EQUAL
}

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): boolean => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case Types.EQUAL:
      return lhs === rhs;

    case Types.NOT_EQUAL:
      return lhs !== rhs;

    default:
      throw `Unexpected equality node type (${node.value}).`;
  }
};
