import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { convertToString, ensureInt32, isNumber } from '../../core/converters';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): number | string => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (node.value === NodeTypes.ADD) {
    if (!isNumber(lhs) || !isNumber(rhs)) {
      return convertToString(lhs) + convertToString(rhs);
    }

    return ensureInt32(lhs) + ensureInt32(rhs);
  }

  if (!isNumber(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.left!.fragment);
  }

  if (!isNumber(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.right!.fragment);
  }

  switch (node.value) {
    case NodeTypes.SUBTRACT:
      return ensureInt32(lhs) - ensureInt32(rhs);

    case NodeTypes.MULTIPLY:
      return ensureInt32(lhs) * ensureInt32(rhs);

    case NodeTypes.DIVIDE:
      return Math.trunc(ensureInt32(lhs) / ensureInt32(rhs));

    case NodeTypes.MODULO:
      return ensureInt32(lhs) % ensureInt32(rhs);

    default:
      throw `Unexpected arithmetic node type (${node.value}).`;
  }
};
