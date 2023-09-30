import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { CallbackTypes, ErrorTypes, NodeType, NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';
import { Cache } from '../cache';

const isRecursion = (scope: Scope, closureNode: NodeType) => {
  return scope.closureNode === closureNode;
};

const isCallable = (node: NodeType): node is NodeType => {
  return node instanceof Core.Node && (node.value === NodeTypes.CLOSURE || node.value === NodeTypes.BUILT_IN);
};

const isBuiltIn = (closureNode: NodeType) => {
  return closureNode.value === NodeTypes.BUILT_IN;
};

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const { enableMemoization } = scope.options;

  const calleeNode = node.left!;
  const closureNode = yield Expression.consumeNode(scope, calleeNode);

  if (!isCallable(closureNode)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, calleeNode.fragment);
  }

  const closureFirstArgumentNode = calleeNode.next!;
  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureBlock = closureParameters.next!;

  const closureScope = yield Parameters.consumeNodes(
    scope,
    calleeNode,
    closureNode,
    closureFirstParameter,
    closureFirstArgumentNode
  );

  if (isBuiltIn(closureNode)) {
    return (closureNode.data.value as CallbackTypes)(closureScope, calleeNode);
  }

  if (enableMemoization && closureFirstArgumentNode && isRecursion(scope, closureNode)) {
    const cacheKey = Cache.buildKey(closureScope);

    if (!scope.cache) {
      scope.cache = new Cache();
      closureScope.cache = scope.cache;

      const result = yield Block.consumeNodes(closureScope, closureBlock.right!);
      scope.cache.store(cacheKey, result);
      return result;
    }

    const cacheResult = scope.cache.retrieve(cacheKey);
    if (cacheResult !== undefined) {
      return cacheResult;
    }

    const result = yield Block.consumeNodes(closureScope, closureBlock.right!);
    scope.cache.store(cacheKey, result);
    return result;
  }

  return Block.consumeNodes(closureScope, closureBlock.right!);
}
