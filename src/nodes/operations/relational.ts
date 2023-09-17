import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Scope } from '../../core/scope';

export const enum Types {
  GREATER_THAN = 1205,
  LESS_THAN,
  GREATER_THAN_OR_EQUAL,
  LESS_THAN_OR_EQUAL
}

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): boolean => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case Types.GREATER_THAN:
      return lhs! > rhs!;

    case Types.LESS_THAN:
      return lhs! < rhs!;

    case Types.GREATER_THAN_OR_EQUAL:
      return lhs! >= rhs!;

    case Types.LESS_THAN_OR_EQUAL:
      return lhs! <= rhs!;

    default:
      throw `Unexpected relational node type (${node.value}).`;
  }
};
