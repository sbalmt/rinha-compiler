import * as Core from '@xcheme/core';

import * as Variable from '../../ast/variable';
import * as Expression from './expression';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  return Variable.consumeNode(scope, node, Expression.consumeNode);
};
