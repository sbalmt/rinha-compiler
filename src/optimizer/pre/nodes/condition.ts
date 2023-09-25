import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const replaceDefinition = (scope: Scope, node: Core.Node<Metadata>) => {
  const lowerNode = node.lowest(Core.NodeDirection.Next) ?? node;
  lowerNode.set(Core.NodeDirection.Next, scope.currentNode.next);
  scope.previousNode.set(scope.previousDirection, node);
};

const consumeSuccessNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  Block.consumeNodes(blockScope, blockScope.currentNode);
};

const consumeFailureNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const blockScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  Block.consumeNodes(blockScope, blockScope.currentNode);
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const condition = Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (condition === true) {
    if (successBlock.right) {
      replaceDefinition(scope, successBlock);
    } else {
      removeDefinition(scope);
    }
  } else if (condition === false) {
    if (failureBlock && failureBlock.right) {
      replaceDefinition(scope, failureBlock);
    } else {
      removeDefinition(scope);
    }
  } else {
    if (successBlock.right) {
      consumeSuccessNode(scope, successBlock);
    }

    if (failureBlock && failureBlock.right) {
      consumeFailureNode(scope, failureBlock);
    }
  }

  return undefined;
};
