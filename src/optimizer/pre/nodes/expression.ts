import * as Core from '@xcheme/core';

import * as Identifier from './identifier';
import * as Integer from './integer';
import * as String from './string';
import * as Boolean from './boolean';
import * as Closure from './closure';
import * as Tuple from './tuple';
import * as Invoke from './invoke';
import * as Assignment from './assignment';
import * as Logical from './logical';
import * as Equality from './equality';
import * as Relational from './relational';
import * as Arithmetic from './arithmetic';

import { VarValueType } from '../../../evaluator/scope';
import { Metadata } from '../../../core/metadata';
import { NodeTypes } from '../../../core/types';
import { Scope } from '../../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return Identifier.consumeNode(node);

    case NodeTypes.INTEGER:
      return Integer.consumeNode(node);

    case NodeTypes.STRING:
      return String.consumeNode(node);

    case NodeTypes.BOOLEAN:
      return Boolean.consumeNode(node);

    case NodeTypes.CLOSURE:
      return Closure.consumeNode(scope, node);

    case NodeTypes.TUPLE:
      return Tuple.consumeNode(scope, node);

    case NodeTypes.ASSIGNMENT:
      return Assignment.consumeNode(scope, node);

    case NodeTypes.LOGICAL_OR:
    case NodeTypes.LOGICAL_AND:
      return Logical.consumeNode(scope, node);

    case NodeTypes.EQUAL:
    case NodeTypes.NOT_EQUAL:
      return Equality.consumeNode(scope, node);

    case NodeTypes.GREATER_THAN:
    case NodeTypes.LESS_THAN:
    case NodeTypes.GREATER_THAN_OR_EQUAL:
    case NodeTypes.LESS_THAN_OR_EQUAL:
      return Relational.consumeNode(scope, node);

    case NodeTypes.ADD:
    case NodeTypes.SUBTRACT:
    case NodeTypes.MULTIPLY:
    case NodeTypes.DIVIDE:
    case NodeTypes.MODULO:
      return Arithmetic.consumeNode(scope, node);

    case NodeTypes.INVOKE:
      return Invoke.consumeNode(scope, node);

    default:
      node.left && consumeNode(scope, node.left);
      node.right && consumeNode(scope, node.right);
      node.next && consumeNode(scope, node.next);
  }

  return undefined;
};
