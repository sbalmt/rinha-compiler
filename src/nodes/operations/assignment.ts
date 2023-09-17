import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Scope, VarValueType } from '../../core/scope';

export const Type = 1200;

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
  const targetNode = node.left!;
  const sourceExpression = node.right!;

  const value = Expression.consumeNode(scope, sourceExpression);

  scope.updateVariable(targetNode, value);

  return value;
};
