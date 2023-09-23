import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  retry: do {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        Variable.consumeNode(node, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        if (Condition.consumeNode(scope, node, node.right!)) {
          continue retry;
        }
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
    node = node.next!;
  } while (node);
};
