import * as Core from '@xcheme/core';

import * as Parameters from './parameters';
import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../core/metadata';
import { identifyCache, retrieveCache, storeCache } from '../cache';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const callerNode = node.left!;
  const closureNode = Expression.consumeNode(scope, callerNode) as Core.Node<Metadata>;

  const closureParameters = closureNode.right!;
  const closureFirstParameter = closureParameters.right!;
  const closureArguments = callerNode.next!;

  const closureScope = Parameters.consumeNodes(scope, closureNode, closureFirstParameter, closureArguments);
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
