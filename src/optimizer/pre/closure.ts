import * as Core from '@xcheme/core';

import * as Closure from '../ast/closure';

import * as Block from './block';

import { Metadata, initNode } from '../../core/metadata';
import { Scope } from '../scope';

const countParameters = (node: Core.Node<Metadata>): number => {
  let counter = 0;

  while (node) {
    node = node.next!;
    counter++;
  }

  return counter;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const parametersNode = node.right!;
  const parametersCount = countParameters(parametersNode.right!);

  initNode(node, {
    minParams: parametersCount
  });

  return Closure.consumeNode(scope, node, Block.consumeNodes);
};
