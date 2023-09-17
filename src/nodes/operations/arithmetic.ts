import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';

import { Scope, VarValueType } from '../../core/scope';
import { convertToString } from '../../core/converters';

export const enum Types {
  ADD = 1209,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
  MODULO
}

const requireNumber = <T extends Core.Types>(value: VarValueType<T>, node: Core.Node<T>): value is number => {
  if (typeof value !== 'number') {
    throw Errors.getMessage(Errors.Types.NOT_A_NUMBER, node.fragment);
  }
  return true;
};

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (node.value === Types.ADD) {
    if (typeof lhs !== 'number' || typeof rhs !== 'number') {
      return convertToString(lhs) + convertToString(rhs);
    }

    return lhs + rhs;
  }

  if (!requireNumber(lhs, node.left!) || !requireNumber(rhs, node.right!)) {
    return 0;
  }

  switch (node.value) {
    case Types.ADD:
      return lhs + rhs;

    case Types.SUBTRACT:
      return lhs - rhs;

    case Types.MULTIPLY:
      return lhs * rhs;

    case Types.DIVIDE:
      return Math.trunc(lhs / rhs);

    case Types.MODULO:
      return lhs % rhs;

    default:
      throw `Unexpected arithmetic node type (${node.value}).`;
  }
};
