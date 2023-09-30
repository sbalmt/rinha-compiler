import * as Errors from '../../core/errors';
import * as Expression from './expression';

import { Arithmetic, Concat } from '../../core/operations';
import { ErrorTypes, NodeType, NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const lhs = yield Expression.consumeNode(scope, node.left!);
  const rhs = yield Expression.consumeNode(scope, node.right!);

  if (Arithmetic.isPerformable(lhs) && Arithmetic.isPerformable(rhs)) {
    return Arithmetic.evaluate(lhs, rhs, node.value);
  }

  if (node.value === NodeTypes.ADD && Concat.isPerformable(lhs) && Concat.isPerformable(rhs)) {
    return Concat.evaluate(lhs, rhs);
  }

  if (!Concat.isPerformable(lhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.left!.fragment);
  }

  if (!Concat.isPerformable(rhs)) {
    throw Errors.getMessage(ErrorTypes.INVALID_OPERATION, node.right!.fragment);
  }

  throw Errors.getMessage(ErrorTypes.UNSUPPORTED_OPERATION, node.fragment);
}
