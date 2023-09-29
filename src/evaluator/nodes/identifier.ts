import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  return scope.readVariable(identifier);
};
