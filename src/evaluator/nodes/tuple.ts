import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { NodeType, TupleTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const resolveValue = (scope: Scope, value: ValueTypes): ValueTypes => {
  if (value instanceof Core.Node) {
    return Expression.consumeNode(scope, value);
  }

  if (value instanceof Array) {
    return resolveTuple(scope, value);
  }

  return value;
};

function* resolveTuple(scope: Scope, tuple: TupleTypes) {
  tuple[0] = yield resolveValue(scope, tuple[0]);
  tuple[1] = yield resolveValue(scope, tuple[1]);

  return tuple;
}

export const consumeNode = (scope: Scope, node: NodeType) => {
  const tuple = node.data.value as TupleTypes;
  return resolveTuple(scope, tuple);
};
