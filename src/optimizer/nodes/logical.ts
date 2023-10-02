import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Logical } from '../../core/operations';
import { ErrorTypes, NodeType, NodeTypes, ValueTypes } from '../../core/types';
import { combineNodes } from '../../core/ast';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const replaceExpression = (lhs: Logical.ValueType, rhs: Logical.ValueType, node: NodeType) => {
  const value = Logical.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes([node.left!, node, node.right!], node.table, NodeTypes.BOOLEAN, value);
  node.swap(newNode);
  return value;
};

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const { constantFolding } = scope.options;

  const lhs = yield Expression.consumeNode(scope, node.left!);
  const rhs = yield Expression.consumeNode(scope, node.right!);

  if (!isLiteral(lhs) || !isLiteral(rhs)) {
    return node;
  }

  if (!Logical.isComparable(lhs)) {
    scope.logs.emplace(Core.LogType.ERROR, node.left!.fragment, ErrorTypes.INVALID_OPERATION);
    return undefined;
  }

  if (!Logical.isComparable(rhs)) {
    scope.logs.emplace(Core.LogType.ERROR, node.right!.fragment, ErrorTypes.INVALID_OPERATION);
    return undefined;
  }

  if (!Logical.isCompatible(lhs, rhs)) {
    scope.logs.emplace(Core.LogType.ERROR, node.fragment, ErrorTypes.UNSUPPORTED_OPERATION);
    return undefined;
  }

  if (constantFolding) {
    return replaceExpression(lhs, rhs, node);
  }

  return node;
}
