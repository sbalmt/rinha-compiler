import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';
import * as Arithmetic from '../../../core/arithmetic';
import * as Concat from '../../../core/concat';

import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../../core/types';
import { combineNodes } from '../ast';
import { Scope } from '../../scope';

const replaceMathExpression = (lhs: Arithmetic.ValueType, rhs: Arithmetic.ValueType, node: Core.Node<Metadata>) => {
  const value = Arithmetic.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes(node.left!, node.right!, NodeTypes.INTEGER, value);
  node.swap(newNode);
  return value;
};

const replaceConcatExpression = (lhs: Concat.ValueType, rhs: Concat.ValueType, node: Core.Node<Metadata>) => {
  const value = Concat.evaluate(lhs, rhs);
  const newNode = combineNodes(node.left!, node.right!, NodeTypes.STRING, value);
  node.swap(newNode);
  return value;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveLiterals } = scope.options;

  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (lhs === undefined || rhs === undefined) {
    return undefined;
  }

  if (Arithmetic.isComparable(lhs) && Arithmetic.isComparable(rhs)) {
    return resolveLiterals ? replaceMathExpression(lhs, rhs, node) : undefined;
  }

  if (node.value === NodeTypes.ADD && Concat.isPerformable(lhs) && Concat.isPerformable(rhs)) {
    return resolveLiterals ? replaceConcatExpression(lhs, rhs, node) : undefined;
  }

  if (!Concat.isPerformable(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Concat.isPerformable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
};
