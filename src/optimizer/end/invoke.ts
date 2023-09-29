import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { ErrorTypes, NodeTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const isClosureBlock = (closureNode: Core.Node<Metadata>) => {
  return closureNode.value === NodeTypes.CLOSURE;
};

const isClosureReference = (closureNode: Core.Node<Metadata>) => {
  return closureNode.value === NodeTypes.IDENTIFIER;
};

const isResolvedClosure = (closureNode: Core.Node<Metadata>) => {
  return closureNode.right !== undefined;
};

export const getClosureBlock = (closureNode: Core.Node<Metadata>) => {
  if (!isResolvedClosure(closureNode)) {
    return undefined;
  }

  if (isClosureReference(closureNode)) {
    if (isClosureBlock(closureNode.right!)) {
      return closureNode.right!;
    }
  } else {
    if (isClosureBlock(closureNode)) {
      return closureNode;
    }
  }

  return undefined;
};

function* consumeAndCountArgumentNodes(scope: Scope, argumentNode: Core.Node<Metadata>) {
  let total = 0;
  while (argumentNode) {
    yield Expression.consumeNode(scope, argumentNode);
    argumentNode = argumentNode.next!;
    total++;
  }
  return total;
}

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const calleeNode = node.left!;
  const calleeFirstArgumentNode = calleeNode.next!;

  const totalArgs = yield consumeAndCountArgumentNodes(scope, calleeFirstArgumentNode);
  const closureNode = yield Expression.consumeNode(scope, calleeNode);
  const closureBlock = getClosureBlock(closureNode);

  if (!closureBlock) {
    return node;
  }

  const { minParams, maxParams } = closureBlock.data;

  if (totalArgs! < minParams!) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, calleeNode.fragment);
  }

  if (totalArgs! > maxParams!) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, calleeNode.fragment);
  }

  return node;
}
