import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhsNode = node.left!;
  const rhsNode = node.right!;

  if (lhsNode.value !== NodeTypes.IDENTIFIER) {
    throw Errors.getMessage(ErrorTypes.INVALID_ASSIGNMENT, lhsNode.fragment);
  }

  const symbol = node.table.find(lhsNode.fragment)!;

  if (symbol.assigned) {
    symbol!.data.mutable = true;
  } else {
    if (!scope.options.enableHoisting) {
      throw Errors.getMessage(ErrorTypes.UNSUPPORTED_REFERENCE, node.fragment);
    }

    scope.pending = true;

    initSymbol(symbol, {
      references: 1,
      mutable: true,
      hoist: true
    });
  }

  if (scope.closureNode) {
    scope.closureNode.data.pure = false;
  }

  return Expression.consumeNode(scope, rhsNode);
};
