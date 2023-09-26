import * as Core from '@xcheme/core';

import * as Variable from './variable';
import * as Expression from './expression';
import * as Condition from './condition';

import { Metadata } from '../../core/metadata';
import { NodeTypes } from '../../core/types';
import { Scope, VarValueType } from '../scope';

const consumeInnerNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const innerScope = new Scope(scope, scope.options);
  return consumeNodes(innerScope, node);
};

const consumeSingleNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  switch (node.value) {
    case NodeTypes.EXPRESSION:
      return Expression.consumeNode(scope, node.right!);

    case NodeTypes.VARIABLE:
      Variable.consumeNode(scope, node.right!);
      break;

    case NodeTypes.IF_ELSE:
      return Condition.consumeNode(scope, node.right!);

    case NodeTypes.BLOCK:
      return consumeInnerNode(scope, node.right!);

    default:
      throw `[EVL]: Unexpected block node type (${node.value}).`;
  }

  return undefined;
};

export const consumeNodes = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const { debug } = scope.options;

  let value;

  while (node) {
    if (debug) {
      console.log('EVL', node.value, node.fragment.data);
    }

    value = consumeSingleNode(scope, node);
    node = node.next!;
  }

  return value;
};
