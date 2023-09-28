import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  while (node) {
    expressionConsumer(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) => {
  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;

  consumeArgumentNodes(scope, argumentsNode, expressionConsumer);
  expressionConsumer(scope, callerNode);

  return node;
};
