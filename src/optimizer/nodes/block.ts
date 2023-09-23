import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';

export const consumeNodes = (node: Core.Node<Metadata>) => {
  retry: do {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        Expression.consumeNode(node.right!);
        break;

      case NodeTypes.VARIABLE:
        if (Variable.consumeNode(node, node.right!)) {
          continue retry;
        }
        break;

      case NodeTypes.IF_ELSE:
        if (Condition.consumeNode(node, node.right!)) {
          continue retry;
        }
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
    node = node.next!;
  } while (node);
};
