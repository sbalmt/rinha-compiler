import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { Scope, createCallScope } from '../scope';
import { LazyCall } from '../lazy';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const closureCall = node.left!;
  const closureNode = Expression.consumeNode(scope, closureCall) as Core.Node<Metadata>;

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;

  const closureArguments = closureCall.next!;
  const closureScope = createCallScope(scope, closureNode, closureFirstParameter, closureArguments);
  const closureBlock = closureParameters.next!;

  let value = Block.consumeNodes(closureScope, closureBlock.right!);

  while (value instanceof LazyCall) {
    value = value.invoke();
  }

  return value;
};
