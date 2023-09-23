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
  return symbol.value === SymbolTypes.BuiltIn || symbol.node!.right!.assigned;
};

const consumeArguments = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
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

    if (!selfCalling && !isDeclared(symbol)) {
      throw Errors.getMessage(ErrorTypes.EARLY_CALL, callNode.fragment);
    }

    if (selfCalling) {
      scope.recursive = true;
    }

    Expression.consumeNode(scope, callNode);
    consumeArguments(scope, callNode.next!);
  }
};
