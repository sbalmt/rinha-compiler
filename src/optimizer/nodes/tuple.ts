import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { TupleTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, value: ValueTypes) => {
  if (value instanceof Core.Node) {
    return Expression.consumeNode(scope, value);
  }

  if (value instanceof Array) {
    return consumeTupleNodes(scope, value);
  }

  return value;
};

function* consumeTupleNodes(scope: Scope, tuple: TupleTypes): ValueTypes {
  tuple[0] = yield consumeInnerNode(scope, tuple[0]);
  tuple[1] = yield consumeInnerNode(scope, tuple[1]);

  return tuple;
}

const detachTupleValueNode = (tupleNode: Core.Node<Metadata>) => {
  tupleNode.set(Core.NodeDirection.Right, undefined);
};

export function* consumeNode(scope: Scope, tupleNode: Core.Node<Metadata>): ValueTypes {
  if (tupleNode.assigned) {
    const tupleValue = tupleNode.data.value as TupleTypes;
    return consumeTupleNodes(scope, tupleValue);
  }

  const firstTupleNode = tupleNode.right!;
  const secondTupleNode = firstTupleNode.next!;

  const data = initNode(tupleNode, {
    value: [
      yield Expression.consumeNode(scope, firstTupleNode),
      yield Expression.consumeNode(scope, secondTupleNode)
    ] as TupleTypes
  });

  detachTupleValueNode(tupleNode);

  return data.value;
}
