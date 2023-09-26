import * as Core from '@xcheme/core';

import * as Condition from '../../ast/condition';

import * as Expression from './expression';
import * as Block from './block';

import { Metadata } from '../../../core/metadata';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  return Condition.consumeNode(scope, node, {
    expressionConsumer: Expression.consumeNode,
    blockConsumer: Block.consumeNodes
  });
};
