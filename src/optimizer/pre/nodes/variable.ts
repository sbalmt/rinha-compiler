import * as Core from '@xcheme/core';

import * as Variable from '../../ast/variable';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../../core/metadata';
import { VarValueType } from '../../../evaluator/scope';
import { Scope } from '../../scope';

const isReference = (value: VarValueType<Metadata>): value is Core.SymbolRecord<Metadata> => {
  return value instanceof Core.SymbolRecord;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment)!;
  const value = Variable.consumeNode(scope, node, Expression.consumeNode);
  const data = initSymbol(symbol);

  if (!isReference(value)) {
    data.literal = value;
  } else {
    data.follow = value;
  }

  return undefined;
};
