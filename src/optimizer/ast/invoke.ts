import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

function* consumeArgumentNodes(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) {
  while (node) {
    yield expressionConsumer(scope, node);
    node = node.next!;
  }
}

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) {
  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;

  yield consumeArgumentNodes(scope, argumentsNode, expressionConsumer);
  yield expressionConsumer(scope, callerNode);

  return node;
}
