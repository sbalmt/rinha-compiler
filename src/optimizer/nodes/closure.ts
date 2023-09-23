import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

const consumeParameters = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const parametersNode = node.right!;
  const blockNode = parametersNode.next!;

  consumeParameters(scope, parametersNode.right!);
  Block.consumeNodes(scope, blockNode.right!);

  node.assign({
    pure: scope.pure,
    recursive: scope.recursive
  });

  return undefined;
};
