import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Condition from './condition';

import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../scope';

const hasNodeReplaced = (scope: Scope, node: Core.Node<Metadata>) => {
  return scope.previousNode.get(scope.previousDirection) !== node;
};

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const innerScope = new Scope(node, Core.NodeDirection.Right, scope.options);
  return consumeNodes(innerScope, innerScope.currentNode);
};

const consumeSingleNode = (scope: Scope, node: Core.Node<Metadata>) => {
  switch (node.value) {
    case NodeTypes.VARIABLE:
      Variable.consumeNode(scope, node.right!);
      break;

    case NodeTypes.IF_ELSE:
      Condition.consumeNode(scope, node.right!);
      break;

    case NodeTypes.BLOCK:
      consumeInnerNode(scope, node);
      break;
  }
};

export const consumeNodes = (scope: Scope, node: Core.Node<Metadata>) => {
  const { debug } = scope.options;

  while (node) {
    if (debug) {
      console.log('END', node.value, node.fragment.data);
    }

    consumeSingleNode(scope, node);

    if (hasNodeReplaced(scope, node)) {
      node = scope.previousNode.get(scope.previousDirection)!;
    } else {
      node = node.next!;
      scope.previousDirection = Core.NodeDirection.Next;
      scope.previousNode = scope.currentNode;
    }

    scope.currentNode = node;
  }
};
