import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { constantFolding } = scope.options;

  const table = scope.isMatchingDeclaration(node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment)!;

  const { mutable, literal } = symbol.data;

  if (literal !== undefined && !mutable && constantFolding) {
    return literal;
  }

  return symbol.node;
};
