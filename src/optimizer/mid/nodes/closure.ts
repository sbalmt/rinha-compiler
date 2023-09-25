import * as Core from '@xcheme/core';

import * as Block from './block';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const parametersNode = node.right!;
  const blockNode = parametersNode.next!;

  Block.consumeNodes(scope, blockNode.right!);

  node.data.pure = scope.pure;
  node.data.recursive = scope.recursive;
  node.data.lazy = scope.lazy;

  return undefined;
};
