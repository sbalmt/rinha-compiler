import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeSingleNode = (scope: Scope, node: Core.Node<Metadata>) => {
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
      consumeNodes(scope, node.right!);
      break;

    default:
      throw `Unexpected block node type (${node.value}).`;
  }
};

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  const { debug } = scope.options;

  while (node) {
    if (debug) {
      console.log('OPT', node.value, node.fragment.data);
    }

    consumeSingleNode(scope, node);
    node = node.next!;
  }
};
