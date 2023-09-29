import * as Core from '@xcheme/core';

import * as Block from './block';
import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const condition = yield Expression.consumeNode(scope, node.right!);
  const blockScope = new Scope(scope, scope.options);

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
}
