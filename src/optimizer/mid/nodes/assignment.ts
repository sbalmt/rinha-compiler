import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  scope.pure = false;

  return Expression.consumeNode(scope, node.right!);
};
