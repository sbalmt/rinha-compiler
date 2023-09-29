import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { CallbackTypes, ErrorTypes, NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const isRecursion = (scope: Scope, closureNode: Core.Node<Metadata>) => {
  return scope.closureNode === closureNode;
};

const isCallable = (node: Core.Node<Metadata> | undefined) => {
  return node instanceof Core.Node && (node.value === NodeTypes.CLOSURE || node.value === NodeTypes.BUILT_IN);
};

const isBuiltIn = (closureNode: Core.Node<Metadata>) => {
  return closureNode.value === NodeTypes.BUILT_IN;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const calleeNode = node.left!;
  const closureNode = yield Expression.consumeNode(scope, calleeNode) as Core.Node<Metadata>;

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, calleeNode.fragment);
  }

  if (isRecursion(scope, closureNode)) {
    // TODO: re-enable memoization
  }

  const closureFirstArgumentNode = calleeNode.next!;
  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;

  const closureScope = yield Parameters.consumeNodes(
    scope,
    calleeNode,
    closureNode,
    closureFirstParameter,
    closureFirstArgumentNode
  );

  if (isBuiltIn(closureNode)) {
    return (closureNode.data.value as CallbackTypes)(closureScope, calleeNode);
  }

  return Block.consumeNodes(closureScope, closureBlock.right!);
}
