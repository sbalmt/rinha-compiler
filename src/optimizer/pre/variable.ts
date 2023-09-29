import * as Core from '@xcheme/core';

import * as Variable from '../ast/variable';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const isReference = (value: ValueTypes): value is Core.Node<Metadata> => {
  return value instanceof Core.Node;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const symbol = node.table.find(node.fragment)!;
  const value = yield Variable.consumeNode(scope, node, Expression.consumeNode);
  const data = initSymbol(symbol);

  if (!isReference(value)) {
    data.literal = value;
  } else if (value.assigned) {
    data.follow = value.data.symbol;
  }

  return node;
}
