import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, blockConsumer: AstConsumer) {
  const parametersNode = node.right!;

  const blockNode = parametersNode.next!;
  const blockScope = new Scope(blockNode, Core.NodeDirection.Right, scope);

  blockScope.closureNode = node;

  yield blockConsumer(blockScope, blockScope.currentNode);

  return node;
}
