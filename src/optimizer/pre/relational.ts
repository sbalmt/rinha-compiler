import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Relational from '../../core/relational';

import * as Expression from './expression';

import { ErrorTypes, NodeTypes, ValueTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { combineNodes } from '../../core/ast';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const replaceExpression = (lhs: Relational.ValueType, rhs: Relational.ValueType, node: Core.Node<Metadata>) => {
  const value = Relational.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN, value);
  node.swap(newNode);
  return value;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const { constantFolding } = scope.options;

  const lhs = yield Expression.consumeNode(scope, node.left!);
  const rhs = yield Expression.consumeNode(scope, node.right!);

  if (!isLiteral(lhs) || !isLiteral(rhs)) {
    return node;
  }

  if (!Relational.isComparable(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Relational.isComparable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  if (!Relational.isCompatible(lhs, rhs)) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
  }

  if (constantFolding) {
    return replaceExpression(lhs, rhs, node);
  }

  return node;
}
