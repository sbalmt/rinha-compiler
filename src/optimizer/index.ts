import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  Block.consumeNodes(node);
};
