import { NodeType } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: NodeType) => {
  const identifier = node.fragment.data;
  return scope.readVariable(identifier);
};
