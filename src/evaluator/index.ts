import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { BaseScopeOptions } from '../core/scope';
import { applyBuiltIn } from './builtin';
import { Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>, options?: BaseScopeOptions) => {
  if (node.next) {
    const scope = new Scope(undefined, options);

    applyBuiltIn(scope);

    Block.consumeNodes(scope, node.next);
  }
};
