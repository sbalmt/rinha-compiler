import * as Core from '@xcheme/core';

import * as Expression from './expression';

import { Metadata } from '../../core/metadata';
import { ValueTypes } from '../../core/types';
import { Scope } from '../scope';

export function* consumeNode(scope: Scope, node: Core.Node<Metadata>): ValueTypes {
  const value = yield Expression.consumeNode(scope, node.right!);
  const identifier = node.fragment.data;
  scope.createVariable(identifier, value);
  return value;
}
