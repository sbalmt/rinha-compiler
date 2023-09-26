import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { replaceNode, replaceSymbol } from '../../core/ast';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

const followReferences = (symbol: Core.SymbolRecord<Metadata>) => {
  while (true) {
    const { mutable, follow } = symbol.data;

    if (mutable || !follow) {
      break;
    }

    symbol.data.references--;
    symbol = follow;
  }

  return symbol;
};

const applyReferenceNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const followedSymbol = followReferences(symbol);

  if (followedSymbol !== symbol) {
    const identifierNode = followedSymbol.node!;

    replaceNode(node, NodeTypes.IDENTIFIER, identifierNode);
    replaceSymbol(symbol, followedSymbol.value, node);
  }

  return symbol;
};

const applyLiteralNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const identifierNode = symbol.node!;
  const valueNode = identifierNode.right!;

  node.swap(valueNode.clone());
  symbol.data.references--;

  return symbol.data.literal;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveReferences } = scope.options;
  const symbol = node.table.find(node.fragment)!;
  const { mutable, literal } = symbol.data;

  if (mutable || !resolveReferences) {
    return symbol;
  }

  if (literal !== undefined) {
    return applyLiteralNode(symbol, node);
  }

  return applyReferenceNode(symbol, node);
};
