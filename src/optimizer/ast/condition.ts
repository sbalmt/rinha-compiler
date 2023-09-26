import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export type Consumers = {
  expressionConsumer: AstConsumer;
  blockConsumer: AstConsumer;
};

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>, blockConsumer: AstConsumer) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  return blockConsumer(blockScope, blockScope.currentNode);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>, consumers: Consumers) => {
  const conditionNode = node.right!;

  consumers.expressionConsumer(scope, conditionNode);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    consumeInnerNode(scope, successBlock, consumers.blockConsumer);
  }

  if (failureBlock && failureBlock.right) {
    consumeInnerNode(scope, failureBlock, consumers.blockConsumer);
  }

  return undefined;
};
