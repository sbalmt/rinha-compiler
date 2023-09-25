import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { resolveComparisonOperation } from '../../../core/operations';
import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { combineNodes } from '../ast';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveLiterals } = scope.optimizations;

  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (resolveLiterals) {
    if (lhs !== undefined && rhs !== undefined) {
      const value = resolveComparisonOperation(lhs, rhs, node.value);
      const newNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN, value);

      node.swap(newNode);
      return value;
    }
  }

  return undefined;
};
