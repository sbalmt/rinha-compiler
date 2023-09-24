import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes, SymbolTypes } from '../../core/types';
import { ErrorTypes } from '../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope, ScopeTypes } from '../scope';
import { createNode } from '../ast';

const isBuiltIn = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.value === SymbolTypes.BuiltIn;
};

const isCallable = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.node!.right!.value === NodeTypes.CLOSURE;
};

const isDeclared = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.node!.right!.assigned;
};

const consumeArguments = (scope: Scope, node: Core.Node<Metadata>) => {
  let counter = 0;

  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
    counter++;
  }

  return counter;
};

const isLateCall = (node: Core.Node<Metadata>) => {
  return node.value !== NodeTypes.IDENTIFIER;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callNode = node.left!;
  const argumentsNode = callNode.next!;
  const argumentsCount = consumeArguments(scope, argumentsNode);

  Expression.consumeNode(scope, callNode);

  if (isLateCall(callNode)) {
    const fastCallNode = createNode(node.fragment, NodeTypes.LATE_CALL, node.table);

    fastCallNode.set(Core.NodeDirection.Left, node.left);
    fastCallNode.set(Core.NodeDirection.Right, node.right);
    fastCallNode.set(Core.NodeDirection.Next, node.next);

    node.swap(fastCallNode);
    return;
  }

  const symbol = resolveSymbol(scope, callNode);

  if (isBuiltIn(symbol)) {
    const fastCallNode = createNode(node.fragment, NodeTypes.FAST_CALL, node.table);

    fastCallNode.set(Core.NodeDirection.Left, node.left);
    fastCallNode.set(Core.NodeDirection.Right, node.right);
    fastCallNode.set(Core.NodeDirection.Next, node.next);

    node.swap(fastCallNode);
  } else {
    if (!isCallable(symbol)) {
      throw Errors.getMessage(ErrorTypes.INVALID_CALL, callNode.fragment);
    }

    const identifier = callNode.fragment.data;
    const selfCalling = scope.name === identifier;

    if (!isDeclared(symbol)) {
      throw Errors.getMessage(ErrorTypes.EARLY_CALL, callNode.fragment);
    }

    if (selfCalling) {
      scope.recursive = true;
    }

    const { parameters, lazy } = symbol.node!.right!.data;

    if (argumentsCount > parameters!) {
      throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argumentsNode.fragment);
    }

    if (argumentsCount < parameters!) {
      throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callNode.fragment);
    }

    if (selfCalling) {
      if (scope.type === ScopeTypes.BLOCK) {
        const callNode = createNode(node.fragment, NodeTypes.LAZY_CALL, node.table);

        node.swap(callNode);
        node.set(Core.NodeDirection.Right, callNode);

        scope.lazy = true;
      } else if (scope.pure && parameters! > 0) {
        const callNode = createNode(node.fragment, NodeTypes.MEMO_CALL, node.table);

        callNode.set(Core.NodeDirection.Left, node.left);
        callNode.set(Core.NodeDirection.Right, node.right);
        callNode.set(Core.NodeDirection.Next, node.next);

        node.swap(callNode);
      }
    } else if (lazy) {
      const callNode = createNode(node.fragment, NodeTypes.TAIL_CALL, node.table);

      callNode.set(Core.NodeDirection.Left, node.left);
      callNode.set(Core.NodeDirection.Right, node.right);
      callNode.set(Core.NodeDirection.Next, node.next);

      node.swap(callNode);
    }
  }
};
