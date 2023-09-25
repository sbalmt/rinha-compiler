import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../../core/metadata';
import { BaseScopeOptions } from '../../core/scope';
import { Scope } from '../scope';

export const consumeNodes = (node: Core.Node<Metadata>, options?: BaseScopeOptions) => {
  const scope = new Scope(node, Core.NodeDirection.Next, options);

  Block.consumeNodes(scope, node);
};
