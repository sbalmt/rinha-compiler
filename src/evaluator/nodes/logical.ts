import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Logical from '../../core/logical';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (!Logical.isComparable(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Logical.isComparable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  if (!Logical.isCompatible(lhs, rhs)) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
  }

  return Logical.evaluate(lhs, rhs, node.value);
};
