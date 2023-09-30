import * as Core from '@xcheme/core';

import * as Block from './block';

import { initNode } from '../../core/metadata';
import { NodeType } from '../../core/types';
import { Scope } from '../scope';

const countParameters = (parameterNode: NodeType): number => {
  let counter = 0;
  while (parameterNode) {
    parameterNode = parameterNode.next!;
    counter++;
  }
  return counter;
};

function* consumeInnerNode(scope: Scope, closureNode: NodeType) {
  const parametersNode = closureNode.right!;

  const blockNode = parametersNode.next!;
  const blockScope = new Scope(blockNode, Core.NodeDirection.Right, scope);

  blockScope.closureDeclarationNode = blockScope.declarationNode;
  blockScope.closureNode = closureNode;

  yield Block.consumeNodes(blockScope, blockScope.currentNode);
  scope.pending = blockScope.pending;

  return closureNode;
}

export const consumeNode = (scope: Scope, closureNode: NodeType) => {
  if (!closureNode.assigned) {
    const parametersNode = closureNode.right!;
    const firstParameterNode = parametersNode.right!;

    initNode(closureNode, {
      minParams: countParameters(firstParameterNode)
    });
  }

  return consumeInnerNode(scope, closureNode);
};
