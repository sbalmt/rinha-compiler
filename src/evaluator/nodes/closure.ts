import { NodeType } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: NodeType) => {
  node.data.scope = scope;
  return node;
};
