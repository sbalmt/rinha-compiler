import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initSymbol } from '../../../core/metadata';
import { Scope } from '../../scope';

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const canRemoveDefinition = (data: Metadata['record']) => {
  const { literal, references, mutable } = data;
  return literal !== undefined && references === 0 && !mutable;
};

const hoistDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);

  scope.currentNode.set(Core.NodeDirection.Next, scope.anchorNode.get(scope.anchorDirection));
  scope.anchorNode.set(scope.anchorDirection, scope.currentNode);

  scope.anchorDirection = Core.NodeDirection.Next;
  scope.anchorNode = scope.currentNode;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { enableHoisting, removeDeadCode } = scope.options;
  const symbol = node.table.find(node.fragment)!;
  const data = initSymbol(symbol);

  if (canRemoveDefinition(data) && removeDeadCode) {
    removeDefinition(scope);
    return;
  }

  Expression.consumeNode(scope, node.right!);

  if (data.hoist && enableHoisting) {
    hoistDefinition(scope);
  }

  return undefined;
};
