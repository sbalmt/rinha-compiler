import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { TupleTypes, ValueTypes } from '../../core/types';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

const resolveValue = (scope: Scope, value: ValueTypes, expressionConsumer: AstConsumer) => {
  if (value instanceof Core.Node) {
    return expressionConsumer(scope, value);
  }

  if (value instanceof Array) {
    return resolveTuple(scope, value, expressionConsumer);
  }

  return value;
};

const resolveTuple = (scope: Scope, tuple: TupleTypes, expressionConsumer: AstConsumer) => {
  tuple[0] = resolveValue(scope, tuple[0], expressionConsumer);
  tuple[1] = resolveValue(scope, tuple[1], expressionConsumer);

  return tuple;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  const tuple = node.data.value as TupleTypes;
  const value = resolveTuple(scope, tuple, expressionConsumer);

  return value;
};
