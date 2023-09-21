import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope } from '../../core/scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): boolean => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  switch (node.value) {
    case NodeTypes.EQUAL:
      return lhs === rhs;

    case NodeTypes.NOT_EQUAL:
      return lhs !== rhs;

    default:
      throw `Unexpected equality node type (${node.value}).`;
  }
};
