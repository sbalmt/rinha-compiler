import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { applyBuiltIn } from './builtin';
import { Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  const scope = new Scope('@global');
  applyBuiltIn(node.table);
  Block.consumeNodes(scope, node);
};
