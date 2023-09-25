import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Identifier from './identifier';

import { Metadata, initNode } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../../scope';

const isRecursiveInvocation = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.declarationNode && scope.declarationNode.fragment.data === node.fragment.data;
};

const isTailCallInvocation = (node: Core.Node<Metadata>) => {
  return node.right!.value === NodeTypes.INVOKE;
};

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const symbol = Identifier.consumeNode(callerNode);

  consumeArgumentNodes(scope, callerNode.next!);

  initNode(node, {
    tailCall: isTailCallInvocation(scope.currentNode),
    selfCall: isRecursiveInvocation(scope, callerNode),
    parameters: symbol.node?.right?.data.parameters ?? 0 // TODO: Get from built-in symbol.
  });

  return Expression.consumeNode(scope, callerNode);
};
