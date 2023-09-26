import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { Scope, createCallScope } from '../scope';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { isLiteral } from '../../core/data';

const isCallable = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.CLOSURE;
};

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const closureCall = node.left!;
  const closureArguments = closureCall.next!;
  const closureNode = Expression.consumeNode(scope, closureCall) as Core.Node<Metadata>;

  // TODO: Further investigate why returning literals from inner tail call
  if (isLiteral(closureNode)) {
    return closureNode;
  }

  if (closureNode instanceof Function) {
    return closureNode(scope, closureArguments);
  }

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, closureNode.fragment);
  }

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;

  if (!closureFirstParameter) {
    const callScope = closureNode.data.value as Scope<Metadata>;
    return Block.consumeNodes(callScope, closureBlock.right!);
  }

  const closureScope = createCallScope(scope, closureNode, closureFirstParameter, closureArguments);

  return Block.consumeNodes(closureScope, closureBlock.right!);
};
