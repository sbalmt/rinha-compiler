import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { combineNodes } from '../ast';
import { VarValueType } from '../../evaluator/scope';
import { Scope } from '../scope';

type ComparisonNodeTypes =
  | NodeTypes.LOGICAL_OR
  | NodeTypes.LOGICAL_AND
  | NodeTypes.EQUAL
  | NodeTypes.NOT_EQUAL
  | NodeTypes.GREATER_THAN
  | NodeTypes.LESS_THAN
  | NodeTypes.GREATER_THAN_OR_EQUAL
  | NodeTypes.LESS_THAN_OR_EQUAL;

const evaluateOperation = (
  lhs: VarValueType<Metadata>,
  rhs: VarValueType<Metadata>,
  operations: ComparisonNodeTypes
) => {
  switch (operations) {
    case NodeTypes.LOGICAL_OR:
      return lhs !== false || rhs !== false;

    case NodeTypes.LOGICAL_AND:
      return lhs !== false && rhs !== false;

    case NodeTypes.EQUAL:
      return lhs === rhs;

    case NodeTypes.NOT_EQUAL:
      return lhs !== rhs;

    case NodeTypes.GREATER_THAN:
      return lhs! > rhs!;

    case NodeTypes.LESS_THAN:
      return lhs! < rhs!;

    case NodeTypes.GREATER_THAN_OR_EQUAL:
      return lhs! >= rhs!;

    case NodeTypes.LESS_THAN_OR_EQUAL:
      return lhs! <= rhs!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(scope, node.left!);
  const rhs = Expression.consumeNode(scope, node.right!);

  if (lhs !== undefined && rhs !== undefined) {
    const evaluatedValue = evaluateOperation(lhs, rhs, node.value);
    const optimizedNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN, evaluatedValue);

    node.swap(optimizedNode);
    return evaluatedValue;
  }

  return undefined;
};
