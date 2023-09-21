import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../../core/scope';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { convertToString } from '../../core/converters';

const isNumber = (value: VarValueType<Metadata>): value is number => {
  return typeof value === 'number';
};

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): number | string => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (node.value === NodeTypes.ADD) {
    if (!isNumber(lhs) || !isNumber(rhs)) {
      return convertToString(lhs) + convertToString(rhs);
    }
    return lhs + rhs;
  }

  if (!isNumber(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.left!.fragment);
  }

  if (!isNumber(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.right!.fragment);
  }

  switch (node.value) {
    case NodeTypes.SUBTRACT:
      return lhs - rhs;

    case NodeTypes.MULTIPLY:
      return lhs * rhs;

    case NodeTypes.DIVIDE:
      return Math.trunc(lhs / rhs);

    case NodeTypes.MODULO:
      return lhs % rhs;

    default:
      throw `Unexpected arithmetic node type (${node.value}).`;
  }
};
