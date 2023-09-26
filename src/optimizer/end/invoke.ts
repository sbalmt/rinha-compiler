import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { NodeTypes } from '../../core/types';
import { ErrorTypes } from '../../core/types';
import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';
import { replaceNode } from '../pre/ast';
import { Scope } from '../scope';

const isClosure = (node: VarValueType<Metadata>): node is Core.Node<Metadata> => {
  return node instanceof Core.Node && node.right?.value === NodeTypes.CLOSURE;
};

const consumeArgumentNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  let counter = 0;

  while (node) {
    Expression.consumeNode(scope, node);
    node = node.next!;
    counter++;
  }

  return counter;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const argumentsNode = callerNode.next!;
  const argumentsCount = consumeArgumentNodes(scope, argumentsNode);
  const closureNode = Expression.consumeNode(scope, callerNode);

  // TODO: If closureNode is a know expression (literal/reference) replace the call instead.

  if (!isClosure(closureNode)) {
    return undefined;
  }

  const closureBody = closureNode.right!;

  const { lazy, pure, parameters } = closureBody.data;
  const { tailCall, selfCall } = node.data;

  if (argumentsCount > parameters) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argumentsNode.fragment);
  }

  if (argumentsCount < parameters) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callerNode.fragment);
  }

  if (selfCall) {
    if (tailCall) {
      replaceNode(node, NodeTypes.LAZY_CALL);
      closureBody.data.lazy = true;
    } else if (pure && parameters > 0) {
      replaceNode(node, NodeTypes.MEMO_CALL);
    }
  } else if (tailCall && lazy) {
    replaceNode(node, NodeTypes.TAIL_CALL);
  }

  return undefined;
};
