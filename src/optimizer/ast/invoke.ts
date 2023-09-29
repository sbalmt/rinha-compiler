import * as Core from '@xcheme/core';

import * as Arguments from './arguments';

import { Metadata } from '../../core/metadata';
import { AstConsumer } from '../types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>, expressionConsumer: AstConsumer) {
  const calleeNode = node.left!;
  const calleeFirstArgumentNode = calleeNode.next!;

  yield Arguments.consumeNodes(scope, calleeFirstArgumentNode, expressionConsumer);
  yield expressionConsumer(scope, calleeNode);

  return node;
}
