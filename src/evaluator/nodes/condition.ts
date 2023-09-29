import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: Core.Node<Metadata>) => {
  if (node.right) {
    const blockScope = new Scope(scope, scope.options);
    return Block.consumeNodes(blockScope, node.right);
  }

  return undefined;
};

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const condition = yield Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next;

  if (condition !== false) {
    return consumeInnerNode(scope, successBlock);
  } else if (failureBlock) {
    return consumeInnerNode(scope, failureBlock);
  }
}
