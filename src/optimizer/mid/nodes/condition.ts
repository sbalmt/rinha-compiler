import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, parent: Core.Node<Metadata>, node: Core.Node<Metadata>) => {
  Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  if (successBlock.right) {
    Block.consumeNodes(scope, successBlock.right);
  }

  if (failureBlock && failureBlock.right) {
    Block.consumeNodes(scope, failureBlock.right);
  }

  return false;
};
