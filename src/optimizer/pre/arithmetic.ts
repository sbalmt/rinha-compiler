import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Arithmetic from '../../core/arithmetic';
import * as Concat from '../../core/concat';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { combineNodes } from '../../core/ast';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

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
  const { constantFolding } = scope.options;

  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

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
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Concat.isPerformable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
};
