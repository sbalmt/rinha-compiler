import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { NodeTypes, SymbolTypes } from '../../../core/types';
import { ErrorTypes } from '../../../core/types';
import { createNode, replaceNode } from '../../pre/ast';
import { resolveSymbol } from '../symbols';
import { Scope } from '../../scope';

const isBuiltIn = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.value === SymbolTypes.BuiltIn;
};

const isCallable = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.node!.right!.value === NodeTypes.CLOSURE;
};

const hasDefinition = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.value === SymbolTypes.BuiltIn || symbol.node!.right!.assigned;
};

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>) => {
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
  const argumentsCount = consumeArgumentNodes(scope, argumentsNode);
  const closureNode = Expression.consumeNode(scope, callerNode);

  const symbol = node.table.find(callerNode.fragment)!;

  if (!(closureNode instanceof Core.Node) || !isCallable(symbol)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callerNode.fragment);
  }

  console.log(closureNode.fragment.data);

  if (!hasDefinition(symbol)) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_CALL, callerNode.fragment);
  }

  if (isLateCall(scope, callerNode)) {
    return;
  }

  if (isBuiltIn(symbol)) {
    replaceNode(node, NodeTypes.FAST_CALL);
    return;
  }

  const { tailCall, selfCall, parameters } = node.data;
  const { pure } = closureNode.data;

  console.log('INVOKE', callerNode.fragment.data, pure);

  if (argumentsCount > parameters) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argumentsNode.fragment);
  }

  if (argumentsCount < parameters) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callerNode.fragment);
  }

  if (selfCall) {
    if (tailCall) {
      const callerNode = createNode(node.fragment, NodeTypes.LAZY_CALL, node.table);
      node.swap(callerNode);
      node.set(Core.NodeDirection.Right, callerNode);
    } else if (pure && parameters > 0) {
      replaceNode(node, NodeTypes.MEMO_CALL);
    }
  } else if (tailCall) {
    replaceNode(node, NodeTypes.TAIL_CALL);
  }
};
