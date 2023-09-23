import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

const consumeParameters = (scope: Scope, node: Core.Node<Metadata>): number => {
  let counter = 0;

  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
    counter++;
  }

  return counter;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const parametersNode = node.right!;
  const parametersCount = consumeParameters(scope, parametersNode.right!);
  const blockNode = parametersNode.next!;

  node.assign({
    parameters: parametersCount
  });

  Block.consumeNodes(scope, blockNode.right!);

  node.data.recursive = scope.recursive;
  node.data.pure = scope.pure;

  return undefined;
};
