import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) {
  const leftHandSideNode = node.left!;
  const rightHandSideNode = node.right!;

  yield expressionConsumer(scope, leftHandSideNode);
  yield expressionConsumer(scope, rightHandSideNode);

  return node;
}
