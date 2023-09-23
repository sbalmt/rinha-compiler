import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope, ScopeTypes } from '../scope';

export const consumeInnerNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhsNode = node.left!;
  const rhsNode = node.right!;

  if (lhsNode.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, lhsNode.fragment);
  }

  const symbol = resolveSymbol(scope, lhsNode);

  symbol.data.mutable = true;
  symbol.data.references++;

  scope.pure = false;

  Expression.consumeNode(scope, lhsNode);

  return Expression.consumeNode(scope, rhsNode);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const type = scope.type;
  scope.type = ScopeTypes.ASSIGNMENT;

  const result = consumeInnerNodes(scope, node);
  scope.type = type;

  return result;
};
