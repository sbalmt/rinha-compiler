import * as Core from '@xcheme/core';

import * as Block from './block';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const parametersNode = node.right!;
  const blockNode = parametersNode.next!;
  const blockScope = new Scope(blockNode, Core.NodeDirection.Right, scope.options);

  Block.consumeNodes(blockScope, blockScope.currentNode);
};
