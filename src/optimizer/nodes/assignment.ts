import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { initSymbol } from '../../core/metadata';
import { ErrorTypes, NodeType, NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: NodeType) => {
  const lhsNode = node.left!;
  const rhsNode = node.right!;

  if (lhsNode.value !== NodeTypes.IDENTIFIER) {
    scope.logs.emplace(Core.LogType.ERROR, lhsNode.fragment, ErrorTypes.INVALID_ASSIGNMENT);
    return undefined;
  }

  const symbol = node.table.find(lhsNode.fragment)!;

  if (symbol.assigned) {
    symbol!.data.mutable = true;
  } else {
    scope.pending = true;

    if (!scope.options.enableHoisting) {
      scope.logs.emplace(Core.LogType.ERROR, node.fragment, ErrorTypes.UNSUPPORTED_REFERENCE);
      return undefined;
    }

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
