import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../core/metadata';
import { Scope } from '../core/scope';

export const Type = 1301;

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): void => {
  const value = Expression.consumeNode(scope, node.right!);

  scope.createVariable(node, value);
};
