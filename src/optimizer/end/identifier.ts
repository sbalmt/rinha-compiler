import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const table = scope.isShadowing(node) ? node.table.parent! : node.table;
  const symbol = table.find(node.fragment)!;

  const { resolveReferences } = scope.options;
  const { mutable, literal } = symbol.data;

  if (literal !== undefined && !mutable && resolveReferences) {
    return literal;
  }

  return symbol.node;
};
