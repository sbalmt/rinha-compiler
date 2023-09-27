import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarTupleType } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarTupleType<Metadata> => {
  const value = node.data.value as VarTupleType<Metadata>;
  const [firstValue, secondValue] = value;

  if (firstValue instanceof Core.Node) {
    value[0] = Expression.consumeNode(scope, firstValue);
  }

  if (secondValue instanceof Core.Node) {
    value[1] = Expression.consumeNode(scope, secondValue);
  }

  return value;
};
