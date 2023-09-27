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
  const closureScope = closureNode.data.value as Scope<Metadata>;
  const callScope = new Scope(closureScope, closureScope.options);

  while (parameterNode && argumentNode) {
    const argumentValue = Expression.consumeNode(scope, argumentNode);
    callScope.createVariable(parameterNode, argumentValue);

    parameterNode = parameterNode.next!;
    argumentNode = argumentNode.next!;
  }

  if (argumentNode && !parameterNode) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, closureNode.fragment);
  }

  if (!parameterNode && parameterNode) {
    throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, closureNode.fragment);
  }

  return callScope;
};
