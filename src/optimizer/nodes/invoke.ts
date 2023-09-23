import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

const consumeArguments = (scope: Scope, node: Core.Node<Metadata>) => {
  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
  }
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callNode = node.left!;
  const argumentsNode = callNode.next!;
  const identifier = callNode.fragment.data;

  Expression.consumeNode(scope, callNode);
  consumeArguments(scope, argumentsNode);

  if (scope.name === identifier) {
    scope.recursive = true;
  }
};
