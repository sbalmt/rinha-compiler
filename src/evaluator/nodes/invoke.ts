import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { CallbackTypes, ErrorTypes, NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const isCallable = (node: Core.Node<Metadata> | undefined) => {
  return node instanceof Core.Node && (node.value === NodeTypes.CLOSURE || node.value === NodeTypes.BUILT_IN);
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const callerNode = node.left!;
  const closureNode = yield Expression.consumeNode(scope, callerNode) as Core.Node<Metadata>;

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, (closureNode ?? callerNode).fragment);
  }

  const closureFirstArgumentNode = callerNode.next!;
  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;

  const closureScope = yield Parameters.consumeNodes(
    scope,
    closureNode,
    closureFirstParameter,
    closureFirstArgumentNode
  );

  if (closureNode.value === NodeTypes.BUILT_IN) {
    return (closureNode.data.value as CallbackTypes)(closureScope, callerNode);
  }

  return Block.consumeNodes(closureScope, closureBlock.right!);
}
