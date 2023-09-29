import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export function* consumeNodes(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) {
  while (node) {
    yield expressionConsumer(scope, node);
    node = node.next!;
  }
}
