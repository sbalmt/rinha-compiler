import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { convertToString, isNumber } from '../../core/converters';
import { resolveArithmeticOperation } from '../../core/operations';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): number | string => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (isNumber(lhs) && isNumber(rhs)) {
    return resolveArithmeticOperation(lhs, rhs, node.value);
  }

  if (node.value === NodeTypes.ADD) {
    return convertToString(lhs) + convertToString(rhs);
  }

  if (!isNumber(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.left!.fragment);
  }

  throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.right!.fragment);
};
