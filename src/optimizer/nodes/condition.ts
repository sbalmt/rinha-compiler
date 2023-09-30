import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const replaceDefinition = (scope: Scope, node: Core.Node<Metadata>) => {
  node.set(Core.NodeDirection.Next, scope.currentNode.next);
  scope.previousNode.set(scope.previousDirection, node);
};

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope);
  return Block.consumeNodes(innerScope, innerScope.currentNode);
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const { constantFolding } = scope.options;

  const condition = yield Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (constantFolding && condition === true) {
    if (successBlock.right) {
      replaceDefinition(scope, successBlock);
    } else {
      removeDefinition(scope);
    }
  } else if (constantFolding && condition === false) {
    if (failureBlock && failureBlock.right) {
      replaceDefinition(scope, failureBlock);
    } else {
      removeDefinition(scope);
    }
  } else {
    if (successBlock.right) {
      yield consumeInnerNode(scope, successBlock);
    }

    if (failureBlock && failureBlock.right) {
      yield consumeInnerNode(scope, failureBlock);
    }
  }

  return node;
}
