import * as Core from '@xcheme/core';

import * as Block from './block';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

const consumeSuccessNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  Block.consumeNodes(blockScope, blockScope.currentNode);
};

const consumeFailureNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  Block.consumeNodes(blockScope, blockScope.currentNode);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    consumeSuccessNode(scope, successBlock);
  }

  if (failureBlock && failureBlock.right) {
    consumeFailureNode(scope, failureBlock);
  }
};
