import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  Expression.consumeNode(node.right!);
};
