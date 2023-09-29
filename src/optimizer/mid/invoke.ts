import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { ErrorTypes, NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const isAnonymous = (node: ValueTypes): node is Core.Node<Metadata> => {
  return node instanceof Core.Node && node.value === NodeTypes.CLOSURE;
};

const isCallable = (node: ValueTypes): node is Core.Node<Metadata> => {
  return node instanceof Core.Node && node.data.symbol?.data.literal === undefined;
};

const isRecursiveInvocation = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.declarationNode && scope.declarationNode.fragment.data === node.fragment.data;
};

function* consumeArgumentNodes(scope: Scope, node: Core.Node<Metadata>) {
  while (node) {
    yield Expression.consumeNode(scope, node);
    node = node.next!;
  }
}

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const callerNode = node.left!;
  const closureNode = yield Expression.consumeNode(scope, callerNode);

  if (!isAnonymous(closureNode) && !isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callerNode.fragment);
  }

  const { minParams } = closureNode.data;

  yield consumeArgumentNodes(scope, callerNode.next!);

  initNode(node, {
    selfCall: isRecursiveInvocation(scope, callerNode),
    minParams
  });

  yield Expression.consumeNode(scope, callerNode);

  return node;
}
