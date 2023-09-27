import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';
import * as Identifier from './identifier';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhsNode = node.left!;
  const rhsNode = node.right!;

  if (lhsNode.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, lhsNode.fragment);
  }

  const targetNode = Identifier.consumeNode(scope, lhsNode);
  const { symbol } = targetNode.data;

  symbol!.data.mutable = true;

  if (scope.scopeNode) {
    scope.scopeNode.data.pure = false;
  }

  return Expression.consumeNode(scope, rhsNode);
};
