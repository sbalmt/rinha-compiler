import * as Core from '@xcheme/core';

import * as Literal from '../ast/literal';
import * as Closure from '../ast/closure';
import * as Tuple from '../ast/tuple';
import * as Ternary from '../ast/ternary';
import * as Assignment from '../ast/assignment';
import * as Binary from '../ast/binary';
import * as Invoke from '../ast/invoke';

import * as Block from './block';
import * as Condition from './condition';
import * as Identifier from './identifier';

import { Metadata } from '../../core/metadata';
import { NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>): ValueTypes => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return Identifier.consumeNode(scope, node);

    case NodeTypes.INTEGER:
    case NodeTypes.STRING:
    case NodeTypes.BOOLEAN:
      return Literal.consumeNode(node);

    case NodeTypes.CLOSURE:
      return Closure.consumeNode(scope, node, Block.consumeNodes);

    case NodeTypes.TUPLE:
      return Tuple.consumeNode(scope, node, consumeNode);

    case NodeTypes.TERNARY:
      return Ternary.consumeNode(scope, node, Condition.consumeNode);

    case NodeTypes.ASSIGNMENT:
      return Assignment.consumeNode(scope, node, consumeNode);

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
      return Binary.consumeNode(scope, node, consumeNode);

    case NodeTypes.INVOKE:
      return Invoke.consumeNode(scope, node, consumeNode);

    default:
      throw `Unable to optimize expression node type (${node.value}).`;
  }
};
