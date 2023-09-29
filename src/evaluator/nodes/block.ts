import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  const innerScope = new Scope(scope, scope.options);
  return consumeNodes(innerScope, node);
};

const consumeSingleNode = (scope: Scope, node: Core.Node<Metadata>) => {
  switch (node.value) {
    case NodeTypes.EXPRESSION:
      return Expression.consumeNode(scope, node.right!);

    case NodeTypes.VARIABLE:
      return Variable.consumeNode(scope, node.right!);

    case NodeTypes.IF_ELSE:
      return Condition.consumeNode(scope, node.right!);

    case NodeTypes.BLOCK:
      return consumeInnerNode(scope, node.right!);

    default:
      throw `Unexpected block node type (${node.value}).`;
  }
};

export function* consumeNodes(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  let value;

  while (node) {
    value = yield consumeSingleNode(scope, node);
    node = node.next!;
  }

  return value;
}
