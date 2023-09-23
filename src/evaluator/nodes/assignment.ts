import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const value = Expression.consumeNode(scope, node.right!);
  scope.updateVariable(node.left!, value);
  return value;
};
