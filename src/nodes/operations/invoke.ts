import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';
import * as Block from '../block';

import { Metadata } from '../../core/metadata';
import { identifyCache, retrieveCache, storeCache } from '../../core/cache';
import { Scope, VarValueType } from '../../core/scope';
import { ErrorTypes } from '../../core/types';

const prepareScope = (
  scope: Scope<Metadata>,
  funcNode: Core.Node<Metadata>,
  callNode: Core.Node<Metadata>,
  paramNode: Core.Node<Metadata>,
  argNode: Core.Node<Metadata>
): Scope<Metadata> => {
  const newScope = new Scope(funcNode.data.value as Scope<Metadata>);

  do {
    if (!argNode) {
      throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, callNode.fragment);
    }

    const argValue = Expression.consumeNode(scope, argNode);
    newScope.createVariable(paramNode, argValue);

    argNode = argNode.next!;
  } while ((paramNode = paramNode.next!));

  if (argNode) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, argNode.fragment);
  }

  return newScope;
};

const consumeFromCache = (scope: Scope<Metadata>, blockNode: Core.Node<Metadata>) => {
  const cacheKey = identifyCache(scope);
  if (!cacheKey) {
    return Block.consumeNodes(scope, blockNode.right!);
  }

  const cacheResult = retrieveCache(cacheKey);
  if (cacheResult) {
    return cacheResult;
  }

  const rawResult = Block.consumeNodes(scope, blockNode.right!);
  storeCache(cacheKey, rawResult);

  return rawResult;
};

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const callNode = node.left!;
  const callArgs = callNode.next!;
  const closureNode = Expression.consumeNode(scope, callNode);

  if (closureNode instanceof Function) {
    return closureNode(scope, callArgs);
  }

  if (!(closureNode instanceof Core.Node)) {
    throw Errors.getMessage(ErrorTypes.INVALID_CALL, callNode.fragment);
  }

  const closureParams = closureNode.right!;
  const closureFirstParam = closureParams.right;
  const closureBlock = closureParams.next!;

  if (!closureFirstParam) {
    return Block.consumeNodes(scope, closureBlock.right!);
  }

  const closureScope = prepareScope(scope, closureNode, callNode, closureFirstParam, callArgs);

  return consumeFromCache(closureScope, closureBlock);
};
