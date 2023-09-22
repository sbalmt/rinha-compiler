import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case NodeTypes.LOGICAL_OR:
      return lhs !== false || rhs !== false;

    case NodeTypes.LOGICAL_AND:
      return lhs !== false && rhs !== false;

    default:
      throw `Unexpected logical node type (${node.value}).`;
  }
};
