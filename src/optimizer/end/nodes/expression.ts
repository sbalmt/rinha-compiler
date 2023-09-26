import * as Core from '@xcheme/core';

import * as Closure from './closure';
import * as Ternary from './ternary';

import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  switch (node.value) {
    case NodeTypes.CLOSURE:
      Closure.consumeNode(scope, node);
      break;

    case NodeTypes.TERNARY:
      Ternary.consumeNode(scope, node);
      break;

    default:
      node.left && consumeNode(scope, node.left);
      node.right && consumeNode(scope, node.right);
      node.next && consumeNode(scope, node.next);
  }
};
