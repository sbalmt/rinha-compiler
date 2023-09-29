import * as Core from '@xcheme/core';

import * as Closure from '../ast/closure';

import * as Block from './block';

import { Metadata, initNode } from '../../core/metadata';
import { Scope } from '../scope';

const countParameters = (parameterNode: Core.Node<Metadata>): number => {
  let counter = 0;
  while (parameterNode) {
    parameterNode = parameterNode.next!;
    counter++;
  }
  return counter;
};

export const consumeNode = (scope: Scope, closureNode: Core.Node<Metadata>) => {
  const parameterNode = closureNode.right!;
  const firstParameterNode = parameterNode.right!;

  initNode(closureNode, {
    minParams: countParameters(firstParameterNode)
  });

  return Closure.consumeNode(scope, closureNode, Block.consumeNodes);
};
