import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const successBlock = node.next!;
  const failureBlock = successBlock.next!;

  Expression.consumeNode(node.right!);

  Block.consumeNodes(successBlock.right!);
  Block.consumeNodes(failureBlock.right!);
};
