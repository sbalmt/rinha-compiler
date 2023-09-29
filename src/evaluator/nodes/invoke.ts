import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { CallbackTypes, ErrorTypes, NodeTypes, ValueTypes } from '../../core/types';
import { isLiteral } from '../../core/data';
import { Scope } from '../scope';

const isCallable = (node: Core.Node<Metadata> | undefined) => {
  return node instanceof Core.Node && (node?.value === NodeTypes.CLOSURE || node?.value === NodeTypes.BUILT_IN);
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const callerNode = node.left!;
  const closureNode = yield Expression.consumeNode(scope, callerNode) as Core.Node<Metadata>;

  // TODO: Further investigate why returning literals from inner tail call
  if (isLiteral(closureNode)) {
    return closureNode;
  }

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, (closureNode ?? callerNode).fragment);
  }

  const argumentsNode = callerNode.next!;
  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;
  const closureScope = yield Parameters.consumeNodes(scope, closureNode, closureFirstParameter, argumentsNode);

  if (closureNode.value === NodeTypes.BUILT_IN) {
    const { value } = closureNode.data;
    return (value as CallbackTypes)(closureScope, callerNode);
  }

  return Block.consumeNodes(closureScope, closureBlock.right!);
}
