import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';

import * as Expression from './expression';
import * as Identifier from './identifier';

import { Metadata } from '../../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../../core/types';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const targetNode = node.left!;

  if (targetNode.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, targetNode.fragment);
  }

  const symbol = Identifier.consumeNode(scope, targetNode);

  symbol.data.mutable = true;

  if (scope.scopeNode) {
    scope.scopeNode.data.pure = false;
  }

  return Expression.consumeNode(scope, node.right!);
};
