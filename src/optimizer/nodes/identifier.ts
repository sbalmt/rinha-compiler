import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import { Metadata, initSymbol } from '../../core/metadata';
import { ErrorTypes, NodeTypes, SymbolTypes } from '../../core/types';
import { replaceNode } from '../../core/ast';
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
  reference.data.references++;

  return node;
};

const replaceByLiteralNode = (targetNode: Core.Node<Metadata>, literalNode: Core.Node<Metadata>) => {
  switch (literalNode.value) {
    case NodeTypes.INTEGER:
    case NodeTypes.STRING:
    case NodeTypes.BOOLEAN:
      replaceNode(targetNode, literalNode.value, literalNode);
      break;

    case NodeTypes.TUPLE:
      replaceNode(targetNode, literalNode.value, literalNode);
      targetNode.set(Core.NodeDirection.Right, literalNode.right);
      break;
  }
};

const replaceByFollowedLiteral = (scope: Scope, node: Core.Node<Metadata>, reference: Core.SymbolRecord<Metadata>) => {
  const referenceNode = reference.node!;
  const literalNode = referenceNode.right!;

  replaceByLiteralNode(node, literalNode);
  scope.pending = true;

  return reference.data.literal;
};

const applyReferenceNode = (scope: Scope, symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const reference = followReferences(symbol);

  if (!reference || reference === symbol) {
    symbol.data.references++;
    return node;
  }

  const { mutable, literal } = reference.data;

  if (mutable || literal === undefined) {
    return replaceByFollowedReference(node, reference);
  }

  return replaceByFollowedLiteral(scope, node, reference);
};

const applyLiteralNode = (scope: Scope, symbol: Core.SymbolRecord<Metadata>, node: Core.Node<Metadata>) => {
  const referenceNode = symbol.node!;
  const literalNode = referenceNode.right!;

  replaceByLiteralNode(node, literalNode);
  scope.pending = true;

  return symbol.data.literal;
};

const canBeHoisted = (symbol: Core.SymbolRecord<Metadata>) => {
  return symbol.value === SymbolTypes.IDENTIFIER;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableHoisting, constantPropagation } = scope.options;

  const table = scope.isMatchingDeclaration(node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment);

  if (!symbol) {
    throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
  }

  if (!symbol.assigned) {
    const hoist = !scope.isMatchingClosureDeclaration(node) && canBeHoisted(symbol);

    if (hoist && !enableHoisting) {
      throw Errors.getMessage(ErrorTypes.UNSUPPORTED_REFERENCE, node.fragment);
    }

    initSymbol(symbol, {
      hoist
    });

    symbol.data.references++;
    scope.pending = true;
  } else {
    const { mutable, literal } = symbol.data;

    if (mutable || !constantPropagation) {
      symbol.data.references++;
      return node;
    }

    if (literal !== undefined) {
      return applyLiteralNode(scope, symbol, node);
    }

    return applyReferenceNode(scope, symbol, node);
  }

  return node;
};
