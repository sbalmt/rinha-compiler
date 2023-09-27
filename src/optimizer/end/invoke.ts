import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { NodeTypes } from '../../core/types';
import { ErrorTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';
import { replaceNode } from '../../core/ast';
import { Scope } from '../scope';

const isCallable = (node: VarValueType<Metadata>): node is Core.Node<Metadata> => {
  return node instanceof Core.Node;
};

const isBuiltInClosure = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.BUILT_IN;
};

const isUserDefinedClosure = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.CLOSURE;
};

const isOptimizable = (callerNode: VarValueType<Metadata>): callerNode is Core.Node<Metadata> => {
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
  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;
  const argumentsCount = consumeArgumentNodes(scope, argumentsNode);
  const closureNode = Expression.consumeNode(scope, callerNode);

  // TODO: If a closureNode is a known expression (literal/reference) replace the call instead.
  if (!isOptimizable(closureNode)) {
    /*if (closureNode instanceof Core.Node) {
      console.log(closureNode.value, closureNode.fragment.data, closureNode.assigned && closureNode.data);
    } else {
      console.log(callerNode.value, callerNode.fragment.data, callerNode.assigned && callerNode.data);
    }*/
    return undefined;
  }

  const closureBody = closureNode.right!;

  const { lazy, pure, parameters } = closureBody.data;
  const { tailCall, selfCall } = node.data;

  if (argumentsCount > parameters) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, callerNode.fragment);
  }

  if (argumentsCount < parameters) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callerNode.fragment);
  }

  if (isBuiltInClosure(closureNode)) {
    replaceNode(closureNode, NodeTypes.FAST_CALL);
    return undefined;
  }

  if (!selfCall && tailCall && lazy) {
    replaceNode(node, NodeTypes.TAIL_CALL);
    return undefined;
  }

  if (selfCall && tailCall) {
    replaceNode(node, NodeTypes.LAZY_CALL);
    closureBody.data.lazy = true;
    return undefined;
  }

  if (selfCall && pure && parameters > 0) {
    replaceNode(node, NodeTypes.MEMO_CALL);
    return undefined;
  }

  return undefined;
};
