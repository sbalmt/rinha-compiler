import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';
import * as Block from '../block';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../../core/scope';
import { identifyCache, retrieveCache, storeCache } from '../../core/cache';

export const Type = 1214;

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const callableNode = node.left!;
  const closureArguments = callableNode.next!;
  const closureNode = Expression.consumeNode(scope, callableNode);

  if (closureNode instanceof Function) {
    return closureNode(scope, closureArguments);
  }

  if (!(closureNode instanceof Core.Node)) {
    throw Errors.getMessage(Errors.Types.INVALID_CALL, callableNode.fragment);
  }

  const closureScope = new Scope(closureNode.data.value as Scope<Metadata>);
  const closureParameters = closureNode.right!;
  const closureBlock = closureParameters.next!;

  if (closureParameters.right) {
    let paramNode = closureParameters.right!;
    let argNode = closureArguments;

    do {
      if (!argNode) {
        throw Errors.getMessage(Errors.Types.MISSING_PARAMETER, callableNode.fragment);
      }

      const argValue = Expression.consumeNode(scope, argNode);
      closureScope.createVariable(paramNode, argValue);

      argNode = argNode.next!;
    } while ((paramNode = paramNode.next!));

    if (argNode) {
      throw Errors.getMessage(Errors.Types.EXTRA_PARAMETER, argNode.fragment);
    }
  }

  const cacheKey = identifyCache(closureScope);

  if (!cacheKey) {
    return Block.consumeNodes(closureScope, closureBlock.right!);
  }

  const cacheResult = retrieveCache(cacheKey);

  if (cacheResult) {
    return cacheResult;
  }

  const result = Block.consumeNodes(closureScope, closureBlock.right!);

  storeCache(cacheKey, result);

  return result;
};
