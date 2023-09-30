import * as Errors from '../../core/errors';

import * as Expression from './expression';

import { ErrorTypes, NodeType, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNodes(
  scope: Scope,
  calleeNode: NodeType,
  closureNode: NodeType,
  parameterNode: NodeType,
  argumentNode: NodeType
): Generator<ValueTypes, Scope, ValueTypes> {
  const closureScope = closureNode.data.scope!;
  const callScope = new Scope(closureScope);

  let argumentCount = 0;

  while (parameterNode) {
    if (!argumentNode) {
      if (argumentCount < closureNode.data.minParams!) {
        throw Errors.getMessage(ErrorTypes.MISSING_ARGUMENT, calleeNode.fragment);
      }
      break;
    }

    const argumentValue = yield Expression.consumeNode(scope, argumentNode);
    const identifier = parameterNode.fragment.data;

    callScope.createVariable(identifier, argumentValue);

    parameterNode = parameterNode.next!;
    argumentNode = argumentNode.next!;

    argumentCount++;
  }

  if (argumentNode) {
    throw Errors.getMessage(ErrorTypes.EXTRA_ARGUMENT, calleeNode.fragment);
  }

  callScope.closureNode = closureNode;
  callScope.cache = scope.cache;

  return callScope;
}
