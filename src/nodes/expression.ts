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

import { Scope, VarValueType } from '../core/scope';

export const Type = 1300;

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
  switch (node.value) {
    case Identifier.Type:
      return Identifier.consumeNode(scope, node);

    case Integer.Type:
      return Integer.consumeNode(node);

    case String.Type:
      return String.consumeNode(node);

    case Boolean.Type:
      return Boolean.consumeNode(node);

    case Closure.Type:
      return Closure.consumeNode(node);

    case Tuple.Type:
      return Tuple.consumeNode(scope, node);

    case Assignment.Type:
      return Assignment.consumeNode(scope, node);

    case Logical.Types.LOGICAL_OR:
    case Logical.Types.LOGICAL_AND:
      return Logical.consumeNode(scope, node);

    case Equality.Types.EQUAL:
    case Equality.Types.NOT_EQUAL:
      return Equality.consumeNode(scope, node);

    case Relational.Types.GREATER_THAN:
    case Relational.Types.LESS_THAN:
    case Relational.Types.GREATER_THAN_OR_EQUAL:
    case Relational.Types.LESS_THAN_OR_EQUAL:
      return Relational.consumeNode(scope, node);

    case Arithmetic.Types.ADD:
    case Arithmetic.Types.SUBTRACT:
    case Arithmetic.Types.MULTIPLY:
    case Arithmetic.Types.DIVIDE:
    case Arithmetic.Types.MODULO:
      return Arithmetic.consumeNode(scope, node);

    case Invoke.Type:
      return Invoke.consumeNode(scope, node.left!);

    default:
      throw `Unexpected expression node type (${node.value}).`;
  }
};
