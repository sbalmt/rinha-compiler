import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { performPostActions } from './actions';
import { Scope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  const scope = new Scope('@global');

  Block.consumeNodes(scope, node);
  performPostActions();
};
