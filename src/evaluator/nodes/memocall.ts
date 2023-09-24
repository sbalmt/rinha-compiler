import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { identifyCache, retrieveCache, storeCache } from '../cache';
import { Scope, createCallScope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const closureCall = node.left!;
  const closureNode = Expression.consumeNode(scope, closureCall) as Core.Node<Metadata>;

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;

  const closureArguments = closureCall.next!;
  const closureScope = createCallScope(scope, closureNode, closureFirstParameter, closureArguments);
  const closureBlock = closureParameters.next!;

  const cacheKey = identifyCache(closureScope);
  if (!cacheKey) {
    return Block.consumeNodes(closureScope, closureBlock.right!);
  }

  const cacheResult = retrieveCache(cacheKey);
  if (cacheResult) {
    return cacheResult;
  }

  const value = Block.consumeNodes(closureScope, closureBlock.right!);
  storeCache(cacheKey, value);

  return value;
};
