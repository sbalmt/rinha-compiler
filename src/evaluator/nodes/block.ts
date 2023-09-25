import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNodes = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  let result;

  do {
    console.log('EVAL', node.fragment.data);

    switch (node.value) {
      case NodeTypes.EXPRESSION:
        result = Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        Variable.consumeNode(scope, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        result = Condition.consumeNode(scope, node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
  } while ((node = node.next!));

  return result;
};
