import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initNode } from '../../../core/metadata';
import { Scope } from '../../scope';

const consumeArguments = (scope: Scope, node: Core.Node<Metadata>) => {
  let counter = 0;

  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
    counter++;
  }

  return counter;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const argumentsCount = consumeArguments(scope, callerNode.next!);

  initNode(node, {
    arguments: argumentsCount
  });

  return Expression.consumeNode(scope, callerNode);
};
