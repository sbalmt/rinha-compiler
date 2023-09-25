import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope, ScopeTypes } from '../scope';

const consumeInnerNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  const { debug } = scope.options;

  do {
    if (debug) {
      console.log('OPT', node.value, node.fragment.data);
    }

    switch (node.value) {
      case NodeTypes.EXPRESSION:
        Expression.consumeNode(scope, node.right!);
        break;

      case NodeTypes.VARIABLE:
        Variable.consumeNode(node, node.right!);
        break;

      case NodeTypes.IF_ELSE:
        Condition.consumeNode(scope, node, node.right!);
        break;

      case NodeTypes.BLOCK:
        consumeInnerNodes(scope, node.right!);
        break;

      default:
        throw `Unexpected block node type (${node.value}).`;
    }
    node = node.next!;
  } while (node);
};

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  const type = scope.type;
  scope.type = ScopeTypes.BLOCK;

  const result = consumeInnerNodes(scope, node);
  scope.type = type;

  return result;
};
