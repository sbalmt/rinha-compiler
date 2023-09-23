import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { NodeTypes, SymbolTypes } from '../../core/types';
import { ErrorTypes } from '../../core/types';
import { resolveSymbol } from '../symbols';
import { Scope } from '../scope';

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

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callNode = node.left!;
  const symbol = resolveSymbol(scope, callNode);

  if (isBuiltIn(symbol)) {
    Expression.consumeNode(scope, callNode);
    consumeArguments(scope, callNode.next!);
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

    const argumentsNode = callNode.next!;
    const argumentsCount = consumeArguments(scope, argumentsNode);

    if (argumentsCount > symbol.node!.right!.data.parameters!) {
      throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argumentsNode.fragment);
    }

    if (argumentsCount < symbol.node!.right!.data.parameters!) {
      throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callNode.fragment);
    }

    Expression.consumeNode(scope, callNode);
  }
};
