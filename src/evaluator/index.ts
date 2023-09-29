import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { iterateAllOver } from '../core/processor';
import { BaseScopeOptions } from '../core/scope';
import { applyBuiltIn } from './builtin';
import { Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>, options?: BaseScopeOptions) => {
  if (node.next) {
    const scope = new Scope(undefined, options);

    applyBuiltIn(scope, node.table);
    iterateAllOver(Block.consumeNodes(scope, node.next));
  }
};
