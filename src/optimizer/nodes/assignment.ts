import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhsNode = node.left!;
  const rhsNode = node.right!;

  if (lhsNode.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, lhsNode.fragment);
  }

  scope.pure = false;

  scope.assignment = true;
  Expression.consumeNode(scope, lhsNode);
  scope.assignment = false;

  const symbol = resolveSymbol(scope, lhsNode);
  symbol.data.references++;

  return Expression.consumeNode(scope, rhsNode);
};
