import * as Core from '@xcheme/core';

import * as Variable from '../ast/variable';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const symbol = node.table.find(node.fragment)!;
  const result = yield Variable.consumeNode(scope, node, Expression.consumeNode);

  const data = initSymbol(symbol);

  if (isLiteral(result)) {
    data.literal = result;
  } else if (result.assigned) {
    data.follow = result.data.symbol;
  }

  return node;
}
