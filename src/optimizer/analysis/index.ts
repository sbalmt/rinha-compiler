import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../../core/metadata';
import { Optimizations, Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>, optimizations: Optimizations) => {
  const scope = new Scope(node, Core.NodeDirection.Next, optimizations);

  Block.consumeNodes(scope, scope.currentNode);
};
