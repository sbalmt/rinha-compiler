import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Scope } from '../core/scope';

export const Type = 1301;

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): void => {
  const value = Expression.consumeNode(scope, node.right!);

  scope.createVariable(node, value);
};
