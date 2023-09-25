import * as Core from '@xcheme/core';

import { Metadata, initSymbol } from '../../../core/metadata';
import { Scope } from '../../scope';

const removeDefinition = (scope: Scope) => {
  scope.previousNode.set(scope.previousDirection, scope.currentNode.next);
};

const canRemoveDefinition = (data: Metadata['record']) => {
  const { literal, references, mutable } = data;
  return (literal !== undefined || references === 0) && !mutable;
};

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const { removeDeadCode } = scope.options;
  const symbol = node.table.find(node.fragment)!;
  const data = initSymbol(symbol);

  if (canRemoveDefinition(data) && removeDeadCode) {
    removeDefinition(scope);
  }
};
