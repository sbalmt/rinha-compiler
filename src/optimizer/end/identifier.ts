import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { resolveReferences } = scope.options;
  const symbol = node.table.find(node.fragment)!;
  const { mutable, literal } = symbol.data;

  if (literal !== undefined && !mutable && resolveReferences) {
    return literal;
  }

  return node;
};
