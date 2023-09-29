import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer): ValueTypes {
  const previousDeclarationNode = scope.declarationNode;
  scope.declarationNode = node;

  const result = yield expressionConsumer(scope, node.right!);
  scope.declarationNode = previousDeclarationNode;

  return result;
}
