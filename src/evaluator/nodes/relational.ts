import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Relational } from '../../core/operations';
import { ErrorTypes, NodeType, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const lhs = yield Expression.consumeNode(scope, node.left!);
  const rhs = yield Expression.consumeNode(scope, node.right!);

  if (!Relational.isComparable(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Relational.isComparable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  if (!Relational.isCompatible(lhs, rhs)) {
    throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
  }

  return Relational.evaluate(lhs, rhs, node.value);
}
