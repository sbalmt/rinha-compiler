import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { NodeTypes, SymbolTypes } from '../../../core/types';
import { ErrorTypes } from '../../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope } from '../scope';
import { createNode, replaceNode } from '../../pre/ast';

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

const isLateCall = (scope: Scope, node: Core.Node<Metadata>) => {
  if (node.value !== NodeTypes.IDENTIFIER) {
    return true;
  }

  const symbol = resolveSymbol(scope, node);

  if (isBuiltIn(symbol)) {
    return symbol.data.mutable;
  }

  return !isCallable(symbol);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;
  const argumentsCount = consumeArguments(scope, argumentsNode);

  Expression.consumeNode(scope, callerNode);

  if (isLateCall(scope, callerNode)) {
    return;
  }

  const symbol = node.table.find(callerNode.fragment)!;

  if (isBuiltIn(symbol)) {
    replaceNode(node, NodeTypes.FAST_CALL);
    return;
  }

  if (!isCallable(symbol)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callerNode.fragment);
  }

  if (!isDeclared(symbol)) {
    throw Errors.getMessage(ErrorTypes.EARLY_CALL, callerNode.fragment);
  }

  const { tailCall, selfCall, parameters } = node.data;

  console.log(callerNode.fragment.data, node.data, callerNode.fragment.data);

  if (argumentsCount > parameters!) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argumentsNode.fragment);
  }

  if (argumentsCount < parameters!) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callerNode.fragment);
  }

  if (selfCall) {
    if (tailCall) {
      console.log('LAZY CALL');
      const callerNode = createNode(node.fragment, NodeTypes.LAZY_CALL, node.table);

      node.swap(callerNode);
      node.set(Core.NodeDirection.Right, callerNode);
    } else if (scope.pure && parameters! > 0) {
      replaceNode(node, NodeTypes.MEMO_CALL);
    }
  } else if (tailCall) {
    console.log('TAIL CALL');
    replaceNode(node, NodeTypes.TAIL_CALL);
  }
};
