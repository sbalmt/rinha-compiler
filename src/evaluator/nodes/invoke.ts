import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, NodeTypes } from '../../core/types';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const isCallable = (node: Core.Node<Metadata>) => {
  return node.value === NodeTypes.CLOSURE;
};

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const closureNode = Expression.consumeNode(scope, callerNode) as Core.Node<Metadata>;

  // TODO: Further investigate why returning literals from inner tail call
  if (isLiteral(closureNode)) {
    return closureNode;
  }

  const argumentsNode = callerNode.next!;

  if (closureNode instanceof Function) {
    return closureNode(scope, argumentsNode);
  }

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, closureNode.fragment);
  }

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;
  const closureScope = Parameters.consumeNodes(scope, closureNode, closureFirstParameter, argumentsNode);

  return Block.consumeNodes(closureScope, closureBlock.right!);
};
