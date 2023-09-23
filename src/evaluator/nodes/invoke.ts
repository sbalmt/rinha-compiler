import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { identifyCache, retrieveCache, storeCache } from '../cache';
import { Scope } from '../scope';

const prepareScope = (
  scope: Scope<Metadata>,
  funcNode: Core.Node<Metadata>,
  paramNode: Core.Node<Metadata>,
  argNode: Core.Node<Metadata>
) => {
  const boundScope = funcNode.data.value as Scope<Metadata>;
  const parametersCount = funcNode.data.parameters!;
  const callScope = new Scope(boundScope);

  for (let counter = 0; counter < parametersCount; ++counter) {
    const argValue = Expression.consumeNode(scope, argNode);

    callScope.createVariable(paramNode, argValue);

    argNode = argNode.next!;
    paramNode = paramNode.next!;
  }

  return callScope;
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

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const callNode = node.left!;
  const callArgs = callNode.next!;
  const closureNode = Expression.consumeNode(scope, callNode) as Core.Node<Metadata>;

  if (closureNode instanceof Function) {
    return closureNode(scope, callArgs);
  }

  const closureParams = closureNode.right!;
  const closureFirstParam = closureParams.right;
  const closureBlock = closureParams.next!;

  if (!closureFirstParam) {
    return Block.consumeNodes(scope, closureBlock.right!);
  }

  const closureScope = prepareScope(scope, closureNode, closureFirstParam, callArgs);
  const { pure, recursive } = closureNode.data;

  if (!pure || !recursive) {
    return Block.consumeNodes(closureScope, closureBlock.right!);
  }

  return consumeFromCache(closureScope, closureBlock);
};
