import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { TupleTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeSingleValueNode = (scope: Scope, value: ValueTypes) => {
  if (value instanceof Core.Node) {
    return Expression.consumeNode(scope, value);
  }

  if (value instanceof Array) {
    return consumeTupleValueNodes(scope, value);
  }

  return value;
};

function* consumeTupleValueNodes(scope: Scope, tuple: TupleTypes): ValueTypes {
  tuple[0] = yield consumeSingleValueNode(scope, tuple[0]);
  tuple[1] = yield consumeSingleValueNode(scope, tuple[1]);

  return tuple;
}

const detachTupleValueNodes = (tupleNode: Core.Node<Metadata>) => {
  tupleNode.set(Core.NodeDirection.Right, undefined);
};

export function* consumeNode(scope: Scope, tupleNode: Core.Node<Metadata>): ValueTypes {
  if (tupleNode.assigned) {
    const tuple = tupleNode.data.value as TupleTypes;
    return consumeTupleValueNodes(scope, tuple);
  }

  const firstTupleValueNode = tupleNode.right!;
  const secondTupleValueNode = firstTupleValueNode.next!;

  const data = initNode(tupleNode, {
    value: [
      yield Expression.consumeNode(scope, firstTupleValueNode),
      yield Expression.consumeNode(scope, secondTupleValueNode)
    ]
  });

  detachTupleValueNodes(tupleNode);

  return data.value;
}
