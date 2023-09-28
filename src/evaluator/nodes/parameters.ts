import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ErrorTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNodes = (
  scope: Scope<Metadata>,
  closureNode: Core.Node<Metadata>,
  parameterNode: Core.Node<Metadata>,
  argumentNode: Core.Node<Metadata>
) => {
  const closureScope = closureNode.data.scope!;
  const callScope = new Scope(closureScope, closureScope.options);
  const { minParams, maxParams } = closureNode.data;

  let argumentsCount = 0;

  while (parameterNode && argumentNode) {
    const argumentValue = Expression.consumeNode(scope, argumentNode);
    const identifier = parameterNode.fragment.data;

    callScope.createVariable(identifier, argumentValue);

    parameterNode = parameterNode.next!;
    argumentNode = argumentNode.next!;

    argumentsCount++;
  }

  if (argumentsCount < minParams) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, closureNode.fragment);
  }

  if (argumentsCount > maxParams) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, closureNode.fragment);
  }

  return callScope;
};
