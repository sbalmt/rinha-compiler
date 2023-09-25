import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../../core/metadata';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment)!;
  const data = initSymbol(symbol);

  if (data.hoist) {
    scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
    scope.currentNode.set(Core.NodeDirection.Next, scope.anchorNode.get(scope.anchorDirection));
    scope.anchorNode.set(scope.anchorDirection, scope.currentNode);

    scope.anchorNode = scope.currentNode;
    scope.anchorDirection = Core.NodeDirection.Next;
  }

  Expression.consumeNode(scope, node.right!);

  return undefined;
};
