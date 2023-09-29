import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { replaceNode } from '../../core/ast';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

const followReferences = (symbol: Core.SymbolRecord<Metadata>): Core.SymbolRecord<Metadata> | undefined => {
  let eligible = symbol;
  let previous;

  for (let current = symbol; current; current = current.data.follow!) {
    if (current.data.mutable) {
      break;
    }

    if (previous) {
      previous.data.references--;
    }

    previous = eligible;
    eligible = current;
  }

  return eligible;
};

const applyReferenceNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const reference = followReferences(symbol);

  if (reference && reference !== symbol) {
    const referenceNode = reference.node!;
    replaceNode(node, NodeTypes.IDENTIFIER, referenceNode);
    node.data.symbol = reference;
  }

  return node;
};

const applyLiteralNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const referenceNode = symbol.node!;
  const valueNode = referenceNode.right!;

  replaceNode(node, valueNode.value, valueNode);
  symbol.data.references--;

  return symbol.data.literal;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { constantFolding, constantPropagation } = scope.options;

  const symbol = node.data.symbol!;

  const { mutable, literal } = symbol.data;

  if (mutable || (!constantFolding && !constantPropagation)) {
    return node;
  }

  if (literal !== undefined) {
    return applyLiteralNode(symbol, node);
  }

  return applyReferenceNode(symbol, node);
};
