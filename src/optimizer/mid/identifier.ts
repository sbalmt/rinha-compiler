import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { replaceNode } from '../../core/ast';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

const followReferences = (symbol: Core.SymbolRecord<Metadata>): Core.SymbolRecord<Metadata> | undefined => {
  const followed = new WeakSet();

  let current = symbol;
  let eligible = current;
  let previous;

  while ((current = current.data.follow!)) {
    if (current.data.mutable || followed.has(current)) {
      break;
    }

    followed.add(current);

    if (previous) {
      previous.data.references--;
    }

    previous = eligible;
    eligible = current;
  }

  return eligible;
};

const replaceByFollowedReference = (node: Core.Node<Metadata>, reference: Core.SymbolRecord<Metadata>) => {
  const referenceNode = reference.node!;

  replaceNode(node, NodeTypes.IDENTIFIER, referenceNode);
  node.data.symbol = reference;

  return node;
};

const replaceByFollowedLiteral = (
  node: Core.Node<Metadata>,
  symbol: Core.SymbolRecord<Metadata>,
  reference: Core.SymbolRecord<Metadata>
) => {
  const referenceNode = reference.node!;
  const literalNode = referenceNode.right!;

  replaceNode(node, literalNode.value, literalNode);
  symbol.data.references--;

  return reference.data.literal;
};

const applyReferenceNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const reference = followReferences(symbol);
  if (!reference || reference === symbol) {
    return node;
  }

  const { mutable, literal } = reference.data;

  if (mutable || literal === undefined) {
    return replaceByFollowedReference(node, reference);
  }

  return replaceByFollowedLiteral(node, symbol, reference);
};

const applyLiteralNode = (symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const referenceNode = symbol.node!;
  const literalNode = referenceNode.right!;

  replaceNode(node, literalNode.value, literalNode);
  symbol.data.references--;

  return symbol.data.literal;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { constantPropagation } = scope.options;

  const symbol = node.data.symbol!;
  const { mutable, literal } = symbol.data;

  if (mutable || !constantPropagation) {
    return node;
  }

  if (literal !== undefined) {
    return applyLiteralNode(symbol, node);
  }

  return applyReferenceNode(symbol, node);
};
