import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { NodeTypes, SymbolTypes } from '../../core/types';
import { createNode } from '../pre/ast';
import { Scope } from '../scope';

const isBuiltIn = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.value === SymbolTypes.BuiltIn;
};

const followReferences = (symbol: Core.SymbolRecord<Metadata>) => {
  while (true) {
    const { mutable, follow } = symbol.data;

    if (mutable || !follow || isBuiltIn(follow)) {
      break;
    }

    symbol = follow;
  }

  return symbol;
};

const applyFollowedReference = (
  followedSymbol: Core.SymbolRecord<Metadata>,
  symbol: Core.SymbolRecord<Metadata>,
  node: Core.Node<Metadata>
) => {
  const identifierNode = followedSymbol.node!;
  const referenceNode = createNode(identifierNode.fragment, NodeTypes.IDENTIFIER, node.table);

  node.swap(referenceNode);
  symbol.data.follow = undefined;

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

  const followedSymbol = followReferences(symbol);

  if (followedSymbol !== symbol) {
    return applyFollowedReference(followedSymbol, symbol, node);
  }

  return symbol;
};
