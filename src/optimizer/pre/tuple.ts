import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata, initNode } from '../../core/metadata';
import { TupleTypes, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const first = yield Expression.consumeNode(scope, node.right!);
  const second = yield Expression.consumeNode(scope, node.right!.next!);
  const value = [first, second] as TupleTypes;

  node.set(Core.NodeDirection.Right, undefined);

  initNode(node, {
    value
  });

  return value;
}
