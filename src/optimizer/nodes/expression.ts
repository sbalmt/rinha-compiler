import * as Core from '@xcheme/core';

import * as Identifier from './identifier';
import * as Integer from './integer';
import * as String from './string';
import * as Boolean from './boolean';
import * as Tuple from './tuple';
import * as Invoke from './invoke';
import * as Arithmetic from './arithmetic';
import * as Comparison from './comparison';

import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';
import { NodeTypes } from '../../core/types';

export const consumeNode = (node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return Identifier.consumeNode(node);

    case NodeTypes.INTEGER:
      return Integer.consumeNode(node);

    case NodeTypes.STRING:
      return String.consumeNode(node);

    case NodeTypes.BOOLEAN:
      return Boolean.consumeNode(node);

    case NodeTypes.TUPLE:
      return Tuple.consumeNode(node);

    case NodeTypes.ASSIGNMENT:
      consumeNode(node.left!);
      consumeNode(node.right!);
      break;

    case NodeTypes.LOGICAL_OR:
    case NodeTypes.LOGICAL_AND:
    case NodeTypes.EQUAL:
    case NodeTypes.NOT_EQUAL:
    case NodeTypes.GREATER_THAN:
    case NodeTypes.LESS_THAN:
    case NodeTypes.GREATER_THAN_OR_EQUAL:
    case NodeTypes.LESS_THAN_OR_EQUAL:
      return Comparison.consumeNode(node);

    case NodeTypes.ADD:
    case NodeTypes.SUBTRACT:
    case NodeTypes.MULTIPLY:
    case NodeTypes.DIVIDE:
    case NodeTypes.MODULO:
      return Arithmetic.consumeNode(node);

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
