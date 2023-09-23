import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { convertToString, isNumber } from '../../core/converters';
import { resolveArithmeticOperation } from '../../core/operations';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { combineNodes } from '../ast';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (isNumber(lhs) && isNumber(rhs)) {
    const evaluatedValue = resolveArithmeticOperation(lhs, rhs, node.value);
    const optimizedNode = combineNodes(node.left!, node.right!, NodeTypes.INTEGER, evaluatedValue);

    node.swap(optimizedNode);
    return evaluatedValue;
  }

  if (lhs !== undefined && rhs !== undefined) {
    if (node.value === NodeTypes.ADD) {
      const concatenatedValue = convertToString(lhs) + convertToString(rhs);
      const optimizedNode = combineNodes(node.left!, node.right!, NodeTypes.STRING, concatenatedValue);

      node.swap(optimizedNode);
      return concatenatedValue;
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
