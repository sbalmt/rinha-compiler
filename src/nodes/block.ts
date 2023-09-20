import * as Core from '@xcheme/core';

import * as Expression from './expression';
import * as Variable from './variable';
import * as Condition from './condition';

import { Metadata } from '../core/metadata';
import { Scope, VarValueType } from '../core/scope';

export const consumeNodes = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  let result;

  do {
    switch (node.value) {
      case Expression.Type:
        result = Expression.consumeNode(scope, node.right!);
        break;

      case Variable.Type:
        Variable.consumeNode(scope, node.right!);
        break;

      case Condition.Type:
        result = Condition.consumeNode(scope, node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
  } while ((node = node.next!));

  return result;
};
