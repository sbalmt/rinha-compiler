import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  const previousDeclarationNode = scope.declarationNode;
  scope.declarationNode = node;

  const value = expressionConsumer(scope, node.right!);
  scope.declarationNode = previousDeclarationNode;

  return value;
};
