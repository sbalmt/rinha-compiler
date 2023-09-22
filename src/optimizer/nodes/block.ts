import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  do {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        Expression.consumeNode(node.right!);
        break;

      case NodeTypes.VARIABLE:
        Variable.consumeNode(node.right!);
        break;

      case NodeTypes.IF_ELSE:
        Condition.consumeNode(node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
  } while ((node = node.next!));
};
