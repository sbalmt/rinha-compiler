import * as Core from '@xcheme/core';

import * as Errors from '../../../core/errors';

import * as Expression from './expression';

import { Metadata, initNode } from '../../../core/metadata';
import { ErrorTypes, NodeTypes, SymbolTypes } from '../../../core/types';
import { VarValueType } from '../../../evaluator/scope';
import { Scope } from '../../scope';

const isBuiltIn = (symbol: Core.SymbolRecord<Metadata>): boolean => {
  return symbol.value === SymbolTypes.BuiltIn;
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

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const symbol = Expression.consumeNode(scope, callerNode);

  if (!isCallable(symbol)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callerNode.fragment);
  }

  consumeArgumentNodes(scope, callerNode.next!);

  initNode(node, {
    tailCall: isTailCallInvocation(scope.currentNode),
    selfCall: isRecursiveInvocation(scope, callerNode),
    parameters: isBuiltIn(symbol) ? 0 : symbol.node?.right?.data.parameters ?? 0 // TODO: Get from built-in symbol.
  });

  return Expression.consumeNode(scope, callerNode);
};
