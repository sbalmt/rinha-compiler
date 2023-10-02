import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Arithmetic, Concat } from '../../core/operations';
import { ErrorTypes, NodeType, NodeTypes, ValueTypes } from '../../core/types';
import { combineNodes } from '../../core/ast';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const replaceMathExpression = (lhs: Arithmetic.ValueType, rhs: Arithmetic.ValueType, node: NodeType) => {
  const value = Arithmetic.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes([node.left!, node, node.right!], node.table, NodeTypes.INTEGER, value);
  node.swap(newNode);
  return value;
};

const replaceConcatExpression = (lhs: Concat.ValueType, rhs: Concat.ValueType, node: NodeType) => {
  const value = Concat.evaluate(lhs, rhs);
  const newNode = combineNodes([node.left!, node, node.right!], node.table, NodeTypes.STRING, value);
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

  if (Arithmetic.isPerformable(lhs) && Arithmetic.isPerformable(rhs)) {
    return constantFolding ? replaceMathExpression(lhs, rhs, node) : node;
  }

  if (node.value === NodeTypes.ADD && Concat.isPerformable(lhs) && Concat.isPerformable(rhs)) {
    return constantFolding ? replaceConcatExpression(lhs, rhs, node) : node;
  }

  if (!Concat.isPerformable(lhs)) {
    scope.logs.emplace(Core.LogType.ERROR, node.left!.fragment, ErrorTypes.INVALID_OPERATION);
  } else if (!Concat.isPerformable(rhs)) {
    scope.logs.emplace(Core.LogType.ERROR, node.right!.fragment, ErrorTypes.INVALID_OPERATION);
  } else {
    scope.logs.emplace(Core.LogType.ERROR, node.fragment, ErrorTypes.UNSUPPORTED_OPERATION);
  }

  return undefined;
}
