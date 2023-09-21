import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../../core/scope';
import { Nodes } from '../../core/types';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): boolean => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case Nodes.GREATER_THAN:
      return lhs! > rhs!;

    case Nodes.LESS_THAN:
      return lhs! < rhs!;

    case Nodes.GREATER_THAN_OR_EQUAL:
      return lhs! >= rhs!;

    case Nodes.LESS_THAN_OR_EQUAL:
      return lhs! <= rhs!;

    default:
      throw `Unexpected relational node type (${node.value}).`;
  }
};
