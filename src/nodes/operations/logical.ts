import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../../core/scope';

export const enum Types {
  LOGICAL_OR = 1201,
  LOGICAL_AND
}

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): boolean => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case Types.LOGICAL_OR:
      return lhs !== false || rhs !== false;

    case Types.LOGICAL_AND:
      return lhs !== false && rhs !== false;

    default:
      throw `Unexpected logical node type (${node.value}).`;
  }
};
