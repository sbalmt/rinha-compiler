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
import { NodeTypes } from '../core/types';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return Identifier.consumeNode(scope, node);

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
      throw `Unexpected expression node type (${node.value}).`;
  }
};
