import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { createScope } from './scope';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  const scope = createScope('@global');

  Block.consumeNodes(scope, node);
};
