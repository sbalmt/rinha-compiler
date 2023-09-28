import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';
import { VarTupleType, VarValueType } from '../../evaluator/scope';
import { AstConsumer } from '../types';

const resolveValue = (scope: Scope, value: VarValueType<Metadata>, expressionConsumer: AstConsumer) => {
  if (value instanceof Core.Node) {
    return expressionConsumer(scope, value);
  }

  if (value instanceof Array) {
    return resolveTuple(scope, value, expressionConsumer);
  }

  return value;
};

const resolveTuple = (scope: Scope, tuple: VarTupleType<Metadata>, expressionConsumer: AstConsumer) => {
  tuple[0] = resolveValue(scope, tuple[0], expressionConsumer);
  tuple[1] = resolveValue(scope, tuple[1], expressionConsumer);

  return tuple;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  const tuple = node.data.value as VarTupleType<Metadata>;
  const value = resolveTuple(scope, tuple, expressionConsumer);

  return value;
};
