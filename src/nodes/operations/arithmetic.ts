import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../../core/scope';
import { convertToString } from '../../core/converters';
import { Nodes } from '../../core/types';

const requireNumber = (value: VarValueType<Metadata>, node: Core.Node<Metadata>): value is number => {
  if (typeof value !== 'number') {
    throw Errors.getMessage(Errors.Types.NOT_A_NUMBER, node.fragment);
  }
  return true;
};

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (node.value === Nodes.ADD) {
    if (typeof lhs !== 'number' || typeof rhs !== 'number') {
      return convertToString(lhs) + convertToString(rhs);
    }

    return lhs + rhs;
  }

  if (!requireNumber(lhs, node.left!) || !requireNumber(rhs, node.right!)) {
    return 0;
  }

  switch (node.value) {
    case Nodes.SUBTRACT:
      return lhs - rhs;

    case Nodes.MULTIPLY:
      return lhs * rhs;

    case Nodes.DIVIDE:
      return Math.trunc(lhs / rhs);

    case Nodes.MODULO:
      return lhs % rhs;

    default:
      throw `Unexpected arithmetic node type (${node.value}).`;
  }
};
