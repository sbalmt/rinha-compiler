import * as Condition from './condition';

import { NodeType } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: NodeType) => {
  return Condition.consumeNode(scope, node.right!);
};
