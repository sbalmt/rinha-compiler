import * as Expression from './expression';

import { NodeType, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const value = yield Expression.consumeNode(scope, node.right!);
  const identifier = node.fragment.data;
  scope.createVariable(identifier, value);
  return value;
}
