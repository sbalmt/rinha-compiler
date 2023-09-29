import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export type Consumers = {
  expressionConsumer: AstConsumer;
  blockConsumer: AstConsumer;
};

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>, blockConsumer: AstConsumer) => {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope);
  return blockConsumer(innerScope, innerScope.currentNode);
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, consumers: Consumers) {
  const conditionNode = node.right!;

  yield consumers.expressionConsumer(scope, conditionNode);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    yield consumeInnerNode(scope, successBlock, consumers.blockConsumer);
  }

  if (failureBlock && failureBlock.right) {
    yield consumeInnerNode(scope, failureBlock, consumers.blockConsumer);
  }

  return node;
}
