import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';
import * as Logical from '../../../core/logical';

import * as Expression from './expression';

import { ErrorTypes, NodeTypes } from '../../../core/types';
import { Metadata } from '../../../core/metadata';
import { combineNodes } from '../ast';
import { Scope } from '../../scope';

const replaceExpression = (lhs: Logical.ValueType, rhs: Logical.ValueType, node: Core.Node<Metadata>) => {
  const value = Logical.evaluate(lhs, rhs, node.value);
  const newNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN, value);
  node.swap(newNode);
  return value;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveLiterals } = scope.options;

  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (lhs !== undefined && rhs !== undefined) {
    if (!Logical.isComparable(lhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
    }

    if (!Logical.isComparable(rhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
    }

    if (!Logical.isCompatible(lhs, rhs)) {
      throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
    }

    if (resolveLiterals) {
      return replaceExpression(lhs, rhs, node);
    }
  }

  return undefined;
};
