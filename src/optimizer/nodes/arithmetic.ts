import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { convertToString, isNumber } from '../../core/converters';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { VarValueType } from '../../evaluator/scope';
import { combineNodes } from '../ast';

const optimizeNodes = (node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(node.left!);
  const rhs = Expression.consumeNode(node.right!);

  if (lhs === undefined || rhs === undefined) {
    return undefined;
  }

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
  }

  return undefined;
};

export const consumeNode = (node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const value = optimizeNodes(node);

  if (value !== undefined) {
    const optimizedNode = combineNodes(node.left!, node.right!, NodeTypes.INTEGER);

    optimizedNode.assign({
      value
    });

    node.swap(optimizedNode);
  }

  return value;
};
