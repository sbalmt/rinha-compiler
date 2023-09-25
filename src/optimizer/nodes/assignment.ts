import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope, ScopeTypes } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  if (node.left!.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, node.left!.fragment);
  }

  scope.pure = false;

  const type = scope.type;
  scope.type = ScopeTypes.ASSIGNMENT;

  Expression.consumeNode(scope, node.left!);

  scope.type = type;

  return Expression.consumeNode(scope, node.right!);
};
