import * as Core from '@xcheme/core';

import * as Integer from './integer';
import * as String from './string';
import * as Boolean from './boolean';
import * as Tuple from './tuple';
import * as Invoke from './invoke';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { VarValueType } from '../../evaluator/scope';

export const consumeNode = (node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      break;

    case NodeTypes.INTEGER:
      return Integer.consumeNode(node);

    case NodeTypes.STRING:
      return String.consumeNode(node);

    case NodeTypes.BOOLEAN:
      return Boolean.consumeNode(node);

    case NodeTypes.TUPLE:
      return Tuple.consumeNode(node);

    case NodeTypes.ASSIGNMENT:
    case NodeTypes.LOGICAL_OR:
    case NodeTypes.LOGICAL_AND:
    case NodeTypes.EQUAL:
    case NodeTypes.NOT_EQUAL:
    case NodeTypes.GREATER_THAN:
    case NodeTypes.LESS_THAN:
    case NodeTypes.GREATER_THAN_OR_EQUAL:
    case NodeTypes.LESS_THAN_OR_EQUAL:
    case NodeTypes.ADD:
    case NodeTypes.SUBTRACT:
    case NodeTypes.MULTIPLY:
    case NodeTypes.DIVIDE:
    case NodeTypes.MODULO:
      node.left && consumeNode(node.left);
      node.right && consumeNode(node.right);
      break;

    case NodeTypes.INVOKE:
      Invoke.consumeNode(node);
      break;

    default:
      node.left && consumeNode(node.left);
      node.right && consumeNode(node.right);
      node.next && consumeNode(node.next);
  }

  return undefined;
};
