import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { VarValueType } from '../../evaluator/scope';
import { Scope } from '../scope';

const isAnonymous = (node: VarValueType<Metadata>): node is Core.Node<Metadata> => {
  return node instanceof Core.Node && node.value === NodeTypes.CLOSURE;
};

const isCallable = (symbol: VarValueType<Metadata>): symbol is Core.SymbolRecord<Metadata> => {
  return symbol instanceof Core.SymbolRecord && symbol.data.literal === undefined;
};

const isRecursiveInvocation = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.declarationNode && scope.declarationNode.fragment.data === node.fragment.data;
};

const isTailCallInvocation = (node: Core.Node<Metadata>) => {
  return node.right!.value === NodeTypes.INVOKE;
};

const getParametersCountFromSymbol = (symbol: Core.SymbolRecord<Metadata>) => {
  const closureNode = symbol.node;
  const closureBody = closureNode?.right;

  if (closureBody && closureBody.assigned) {
    return closureBody.data.minParams;
  }

  return -1;
};

const getParametersCountFromClosure = (node: Core.Node<Metadata>) => {
  return node.data.minParams;
};

const getParametersCount = (nodeOrSymbol: Core.SymbolRecord<Metadata> | Core.Node<Metadata>) => {
  if (isAnonymous(nodeOrSymbol)) {
    return getParametersCountFromClosure(nodeOrSymbol);
  }
  return getParametersCountFromSymbol(nodeOrSymbol);
};

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const closureNodeOrSymbol = Expression.consumeNode(scope, callerNode);

  if (!isAnonymous(closureNodeOrSymbol) && !isCallable(closureNodeOrSymbol)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callerNode.fragment);
  }

  consumeArgumentNodes(scope, callerNode.next!);

  initNode(node, {
    selfCall: isRecursiveInvocation(scope, callerNode),
    minParams: getParametersCount(closureNodeOrSymbol),
    tailCall: isTailCallInvocation(scope.currentNode)
  });

  return Expression.consumeNode(scope, callerNode);
};
