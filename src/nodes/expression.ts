import * as Core from '@xcheme/core';

import * as Identifier from './operands/identifier';
import * as Integer from './operands/integer';
import * as String from './operands/string';
import * as Boolean from './operands/boolean';
import * as Closure from './operands/closure';
import * as Tuple from './operands/tuple';

import * as Invoke from './operations/invoke';
import * as Arithmetic from './operations/arithmetic';
import * as Relational from './operations/relational';
import * as Equality from './operations/equality';
import * as Logical from './operations/logical';
import * as Assignment from './operations/assignment';

import { Metadata } from '../core/metadata';
import { Scope, VarValueType } from '../core/scope';
import { Nodes } from '../core/types';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case Nodes.IDENTIFIER:
      return Identifier.consumeNode(scope, node);

    case Nodes.INTEGER:
      return Integer.consumeNode(node);

    case Nodes.STRING:
      return String.consumeNode(node);

    case Nodes.BOOLEAN:
      return Boolean.consumeNode(node);

    case Nodes.CLOSURE:
      return Closure.consumeNode(scope, node);

    case Nodes.TUPLE:
      return Tuple.consumeNode(scope, node);

    case Nodes.ASSIGNMENT:
      return Assignment.consumeNode(scope, node);

    case Nodes.LOGICAL_OR:
    case Nodes.LOGICAL_AND:
      return Logical.consumeNode(scope, node);

    case Nodes.EQUAL:
    case Nodes.NOT_EQUAL:
      return Equality.consumeNode(scope, node);

    case Nodes.GREATER_THAN:
    case Nodes.LESS_THAN:
    case Nodes.GREATER_THAN_OR_EQUAL:
    case Nodes.LESS_THAN_OR_EQUAL:
      return Relational.consumeNode(scope, node);

    case Nodes.ADD:
    case Nodes.SUBTRACT:
    case Nodes.MULTIPLY:
    case Nodes.DIVIDE:
    case Nodes.MODULO:
      return Arithmetic.consumeNode(scope, node);

    case Nodes.INVOKE:
      return Invoke.consumeNode(scope, node);

    default:
      throw `Unexpected expression node type (${node.value}).`;
  }
};
