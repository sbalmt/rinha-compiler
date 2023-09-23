import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { convertToString, ensureInt32, isNumber } from '../../core/converters';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { combineNodes } from '../ast';
import { Scope } from '../scope';

type ArithmeticNodeTypes =
  | NodeTypes.ADD
  | NodeTypes.SUBTRACT
  | NodeTypes.MULTIPLY
  | NodeTypes.DIVIDE
  | NodeTypes.MODULO;

const evaluateOperation = (lhs: number, rhs: number, operation: ArithmeticNodeTypes) => {
  switch (operation) {
    case NodeTypes.ADD:
      return ensureInt32(lhs) + ensureInt32(rhs);

    case NodeTypes.SUBTRACT:
      return ensureInt32(lhs) - ensureInt32(rhs);

    case NodeTypes.MULTIPLY:
      return ensureInt32(lhs) * ensureInt32(rhs);

    case NodeTypes.DIVIDE:
      return Math.trunc(ensureInt32(lhs) / ensureInt32(rhs));

    case NodeTypes.MODULO:
      return ensureInt32(lhs) % ensureInt32(rhs);
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (isNumber(lhs) && isNumber(rhs)) {
    const evaluatedValue = evaluateOperation(lhs, rhs, node.value);
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
