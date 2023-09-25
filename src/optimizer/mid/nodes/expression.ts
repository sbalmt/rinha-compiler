import * as Core from '@xcheme/core';

import * as Identifier from './identifier';
import * as Literal from './literal';
import * as Closure from './closure';
import * as Invoke from './invoke';
import * as Assignment from './assignment';

import { Metadata } from '../../../core/metadata';
import { VarValueType } from '../../../evaluator/scope';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return Identifier.consumeNode(node);

    case NodeTypes.INTEGER:
    case NodeTypes.STRING:
    case NodeTypes.BOOLEAN:
    case NodeTypes.TUPLE:
      return Literal.consumeNode(node);

    case NodeTypes.CLOSURE:
      return Closure.consumeNode(scope, node);

    case NodeTypes.ASSIGNMENT:
      return Assignment.consumeNode(scope, node);

    case NodeTypes.INVOKE:
      Invoke.consumeNode(scope, node);
      break;

    default:
      node.left && consumeNode(scope, node.left);
      node.right && consumeNode(scope, node.right);
      node.next && consumeNode(scope, node.next);
  }

  return undefined;
};
