import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

const resolvedNode = (parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const nextNode = parent.next;
  const lowestNode = node.lowest(Core.NodeDirection.Next) ?? parent;

  lowestNode.set(Core.NodeDirection.Next, nextNode);
  parent.swap(node);
};

export const consumeNode = (scope: Scope, parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  const condition = Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (condition === true) {
    resolvedNode(parent, successBlock.right!);
    return true;
  }

  if (condition === false) {
    resolvedNode(parent, failureBlock.right!);
    return true;
  }

  Block.consumeNodes(scope, successBlock.right!);
  Block.consumeNodes(scope, failureBlock.right!);

  return false;
};
