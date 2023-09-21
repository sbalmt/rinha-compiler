import * as Core from '@xcheme/core';

import * as Expression from '../expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../../core/scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const targetNode = node.left!;
  const sourceExpression = node.right!;

  const value = Expression.consumeNode(scope, sourceExpression);

  scope.updateVariable(targetNode, value);

  return value;
};
