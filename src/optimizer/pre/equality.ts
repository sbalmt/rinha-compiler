import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Equality from '../../core/equality';

import * as Expression from './expression';

import { ErrorTypes, NodeTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { combineNodes } from '../../core/ast';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const replaceExpression = (lhs: Equality.ValueType, rhs: Equality.ValueType, node: Core.Node<Metadata>) => {
  const value = Equality.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN, value);
  node.swap(newNode);
  return value;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { constantFolding } = scope.options;

  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (isLiteral(lhs) && !isLiteral(rhs)) {
    if (!Equality.isComparable(lhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
    }

    if (!Equality.isComparable(rhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
    }

    if (!Equality.isCompatible(lhs, rhs)) {
      throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
    }

    if (constantFolding) {
      return replaceExpression(lhs, rhs, node);
    }
  }

  return node;
};
