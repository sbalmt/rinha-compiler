import * as Core from '@xcheme/core';

import * as Block from '../ast/block';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { Scope } from '../scope';

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  return Block.consumeNodes(scope, node, {
    expressionConsumer: Expression.consumeNode,
    variableConsumer: Variable.consumeNode,
    conditionConsumer: Condition.consumeNode
  });
};
