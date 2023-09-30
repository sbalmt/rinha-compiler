import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNodes(
  scope: Scope,
  calleeNode: Core.Node<Metadata>,
  closureNode: Core.Node<Metadata>,
  parameterNode: Core.Node<Metadata>,
  argumentNode: Core.Node<Metadata>
): Generator<ValueTypes, Scope, ValueTypes> {
  const closureScope = closureNode.data.scope!;
  const callScope = new Scope(closureScope);

  const { minParams, maxParams } = closureNode.data;

  let argumentsCount = 0;

  while (parameterNode && argumentNode) {
    const argumentValue = yield Expression.consumeNode(scope, argumentNode);
    const identifier = parameterNode.fragment.data;

    callScope.createVariable(identifier, argumentValue);

    argumentsCount++;

    parameterNode = parameterNode.next!;
    argumentNode = argumentNode.next!;
  }

  if (argumentsCount < minParams!) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, calleeNode.fragment);
  }

  if (argumentsCount > maxParams!) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, calleeNode.fragment);
  }

  callScope.closureNode = closureNode;
  callScope.cache = scope.cache;

  return callScope;
}
