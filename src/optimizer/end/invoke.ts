import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { ErrorTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { NodeTypes, ValueTypes } from '../../core/types';
//import { replaceNode } from '../../core/ast';
import { Scope } from '../scope';

const isCallable = (node: ValueTypes): node is Core.Node<Metadata> => {
  return node instanceof Core.Node && node.right instanceof Core.Node;
};

const isBuiltInClosure = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.BUILT_IN;
};

const isUserDefinedClosure = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.CLOSURE;
};

const isOptimizable = (callerNode: ValueTypes): callerNode is Core.Node<Metadata> => {
  return isCallable(callerNode) && (isBuiltInClosure(callerNode.right!) || isUserDefinedClosure(callerNode.right!));
};

const consumeArgumentNodes = (scope: Scope, argumentNode: Core.Node<Metadata>) => {
  let counter = 0;

  while (argumentNode) {
    Expression.consumeNode(scope, argumentNode);
    argumentNode = argumentNode.next!;
    counter++;
  }

  return counter;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableMemoization } = scope.options;

  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;
  const argumentsCount = consumeArgumentNodes(scope, argumentsNode);
  const closureNode = Expression.consumeNode(scope, callerNode);

  // TODO: If a closureNode is a known expression (literal/reference) replace the call instead.
  if (!isOptimizable(closureNode)) {
    return node;
  }

  const closureBody = closureNode.right!;

  const { pure, minParams, maxParams } = closureBody.data;
  const { selfCall } = node.data;

  if (argumentsCount < minParams) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callerNode.fragment);
  }

  if (argumentsCount > maxParams) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, callerNode.fragment);
  }

  if (selfCall && pure && minParams > 0) {
    if (enableMemoization) {
      //console.log('MEMO');
      // replaceNode(node, NodeTypes.MEMO_CALL);
    }
    return node;
  }

  return node;
};
