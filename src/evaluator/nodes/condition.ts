import * as Block from './block';
import * as Expression from './expression';

import { NodeType, ValueTypes } from '../../core/types';
import { Scope } from '../scope';

const consumeInnerNode = (scope: Scope, node: NodeType) => {
  if (node.right) {
    const innerScope = new Scope(scope);
    return Block.consumeNodes(innerScope, node.right);
  }
  return undefined;
};

export function* consumeNode(scope: Scope, node: NodeType): ValueTypes {
  const condition = yield Expression.consumeNode(scope, node.right!);

  const successBlock = node.next!;
  const failureBlock = successBlock.next;

  if (condition !== false) {
    return consumeInnerNode(scope, successBlock);
  } else if (failureBlock) {
    return consumeInnerNode(scope, failureBlock);
  }
}
