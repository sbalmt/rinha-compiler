import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';
import { VarTupleType, VarValueType } from '../../evaluator/scope';

const resolveValue = (scope: Scope, value: VarValueType<Metadata>): VarValueType<Metadata> => {
  if (value instanceof Core.Node) {
    return Expression.consumeNode(scope, value);
  }

  if (value instanceof Array) {
    return resolveTuple(scope, value);
  }

  return value;
};

const resolveTuple = (scope: Scope, tuple: VarTupleType<Metadata>): VarTupleType<Metadata> => {
  tuple[0] = resolveValue(scope, tuple[0]);
  tuple[1] = resolveValue(scope, tuple[1]);

  return tuple;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const tuple = node.data.value as VarTupleType<Metadata>;
  const value = resolveTuple(scope, tuple);

  return value;
};
