import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../../core/metadata';
import { Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  const scope = new Scope(node, Core.NodeDirection.Next);

  Block.consumeNodes(scope, scope.currentNode);
};
