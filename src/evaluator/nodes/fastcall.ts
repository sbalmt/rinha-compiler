import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const closureCall = node.left!;
  const closureNode = Expression.consumeNode(scope, closureCall) as Function;
  const closureArguments = closureCall.next!;

  return closureNode(scope, closureArguments);
};
