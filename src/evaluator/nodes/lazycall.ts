import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { LazyCall } from '../lazy';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  return new LazyCall(scope, node.right!);
};
