import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Variable from './variable';
import * as Condition from './condition';

import { Metadata } from '../core/metadata';
import { Scope, VarValueType } from '../core/scope';
import { NodeTypes } from '../core/types';

export const consumeNodes = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  let result;

  do {
    switch (node.value) {
      case NodeTypes.EXPRESSION:
        result = Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        Variable.consumeNode(scope, node.right!);
        break;

      case NodeTypes.CONDITION:
        result = Condition.consumeNode(scope, node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
  } while ((node = node.next!));

  return result;
};
