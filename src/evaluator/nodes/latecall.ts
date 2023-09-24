import * as Core from '@xcheme/core';

import * as Invoke from './invoke';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  return Invoke.consumeNode(scope, node);
};
