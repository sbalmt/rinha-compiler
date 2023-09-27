import * as Core from '@xcheme/core';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { LazyCall } from '../lazy';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const closureNode = Expression.consumeNode(scope, callerNode) as Core.Node<Metadata>;

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureArguments = callerNode.next!;

  const closureScope = Parameters.consumeNodes(scope, closureNode, closureFirstParameter, closureArguments);
  const closureBlock = closureParameters.next!;

  let value = Block.consumeNodes(closureScope, closureBlock.right!);

  while (value instanceof LazyCall) {
    value = value.invoke();
  }

  return value;
};
