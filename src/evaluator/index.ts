import * as Block from './nodes/block';

import { NodeType } from '../core/types';
import { iterateAllOver } from '../core/processor';
import { BaseScopeOptions } from '../core/scope';
import { applyBuiltIn } from './builtin';
import { Scope } from './scope';

export const consumeNodes = (node: NodeType, options?: BaseScopeOptions) => {
  if (node.next) {
    const scope = new Scope(undefined, options);
    applyBuiltIn(scope, node.table);
    iterateAllOver(Block.consumeNodes(scope, node.next));
  }
};
