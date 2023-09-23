import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { Scope, VarValueType } from '../scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): VarValueType<Metadata> => {
  const condition = Expression.consumeNode(scope, node.right!);
  const blockScope = new Scope(scope);

  const successBlock = node.next!;
  const failureBlock = successBlock.next;

  if (condition !== false) {
    if (successBlock.right) {
      return Block.consumeNodes(blockScope, successBlock.right);
    }
  } else if (failureBlock) {
    if (failureBlock.right) {
      return Block.consumeNodes(blockScope, failureBlock.right);
    }
  }

  return undefined;
};
