import * as Core from '@xcheme/core';

import * as Condition from './condition';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  Condition.consumeNode(scope, node.right!);

  return undefined;
};
