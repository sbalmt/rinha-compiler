import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';
import * as Expression from '../expression';
import * as Block from '../block';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../../core/scope';

export const Type = 1214;

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const closureNode = scope.readVariable(node);
  const closureArguments = node.next!;

  if (closureNode instanceof Function) {
    return closureNode(scope, closureArguments);
  }

  if (!(closureNode instanceof Core.Node)) {
    throw Errors.getMessage(Errors.Types.INVALID_CALL, node.fragment);
  }

  const closureScope = new Scope(scope);
  const closureParameters = closureNode.right!;
  const closureBlock = closureParameters.next!;

  if (closureParameters.right) {
    let paramNode = closureParameters.right!;
    let argNode = closureArguments;

    do {
      if (!argNode) {
        throw Errors.getMessage(Errors.Types.MISSING_PARAMETER, node.fragment);
      }

      const argValue = Expression.consumeNode(scope, argNode);

      closureScope.createVariable(paramNode, argValue);
      argNode = argNode.next!;
    } while ((paramNode = paramNode.next!));

    if (argNode) {
      throw Errors.getMessage(Errors.Types.EXTRA_PARAMETER, argNode.fragment);
    }
  }

  return Block.consumeNodes(closureScope, closureBlock.right!);
};
