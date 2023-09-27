import * as Core from '@xcheme/core';

import * as Errors from '../core/errors';
import * as Expression from './nodes/expression';

import { Metadata } from '../core/metadata';
import { ErrorTypes, NodeTypes } from '../core/types';
import { convertToString } from '../core/data';
import { Scope } from './scope';

export const applyBuiltIn = (scope: Scope<Metadata>): void => {
  scope.createCustomVariable('first', firstFn);
  scope.createCustomVariable('second', secondFn);
  scope.createCustomVariable('assert', assertFn);
  scope.createCustomVariable('print', printFn);
};

const firstFn = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const tuple = Expression.consumeNode(scope, node);

  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, node.fragment);
  }

  return tuple[0];
};

const secondFn = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const tuple = Expression.consumeNode(scope, node);

  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, node.fragment);
  }

  return tuple[1];
};

const assertFn = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const result = Expression.consumeNode(scope, node);
  const errorNode = node.next;

  if (result !== false) {
    return result;
  }

  if (errorNode?.value !== NodeTypes.STRING) {
    throw Errors.getMessage(ErrorTypes.ASSERTION_FAILED, node.fragment);
  }

  throw Errors.formatMessage(errorNode.data.value as string, node.fragment);
};

const printFn = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const result = Expression.consumeNode(scope, node);

  console.log(convertToString(result));

  return result;
};
