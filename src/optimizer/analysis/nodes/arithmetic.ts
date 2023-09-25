import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { convertToString, isNumber } from '../../../core/converters';
import { resolveArithmeticOperation } from '../../../core/operations';
import { ErrorTypes, NodeTypes } from '../../../core/types';
import { combineNodes } from '../ast';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (isNumber(lhs) && isNumber(rhs)) {
    const value = resolveArithmeticOperation(lhs, rhs, node.value);
    const newNode = combineNodes(node.left!, node.right!, NodeTypes.INTEGER, value);

    node.swap(newNode);
    return value;
  }

  if (lhs !== undefined && rhs !== undefined) {
    if (node.value === NodeTypes.ADD) {
      const value = convertToString(lhs) + convertToString(rhs);
      const newNode = combineNodes(node.left!, node.right!, NodeTypes.STRING, value);

      node.swap(newNode);
      return value;
    }

    if (!isNumber(lhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.left!.fragment);
    }

    if (!isNumber(rhs)) {
      throw Errors.getMessage(ErrorTypes.INVALID_NUMBER, node.right!.fragment);
    }
  }

  return undefined;
};
