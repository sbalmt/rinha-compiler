import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { combineNodes } from '../ast';

const optimizeNodes = (node: Core.Node<Metadata>) => {
  const lhs = Expression.consumeNode(node.left!);
  const rhs = Expression.consumeNode(node.right!);

  if (lhs === undefined || rhs === undefined) {
    return undefined;
  }

  switch (node.value) {
    case NodeTypes.LOGICAL_OR:
      return lhs !== false || rhs !== false;

    case NodeTypes.LOGICAL_AND:
      return lhs !== false && rhs !== false;

    case NodeTypes.EQUAL:
      return lhs === rhs;

    case NodeTypes.NOT_EQUAL:
      return lhs !== rhs;

    case NodeTypes.GREATER_THAN:
      return lhs > rhs;

    case NodeTypes.LESS_THAN:
      return lhs < rhs;

    case NodeTypes.GREATER_THAN_OR_EQUAL:
      return lhs >= rhs;

    case NodeTypes.LESS_THAN_OR_EQUAL:
      return lhs <= rhs;
  }

  return undefined;
};

export const consumeNode = (node: Core.Node<Metadata>) => {
  const value = optimizeNodes(node);

  if (value !== undefined) {
    const optimizedNode = combineNodes(node.left!, node.right!, NodeTypes.BOOLEAN);

    optimizedNode.assign({
      value
    });

    node.swap(optimizedNode);
  }

  return value;
};
