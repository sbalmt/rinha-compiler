import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  const expressionNode = node.right!;

  return expressionConsumer(scope, expressionNode);
};
