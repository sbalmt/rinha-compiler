import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';

const consumeArgs = (node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(node);
    node = node.next!;
  }
};

export const consumeNode = (node: Core.Node<Metadata>) => {
  const callNode = node.left!;
  let argNode = callNode.next!;

  Expression.consumeNode(callNode);

  consumeArgs(argNode);
};
