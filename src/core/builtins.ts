import * as Core from '@xcheme/core';

import * as Expression from '../nodes/expression';
import * as Errors from './errors';

import { Metadata } from './metadata';
import { convertToString } from './converters';
import { ErrorTypes } from './types';
import { Scope } from './scope';

export const injectBuiltIns = (scope: Scope<Metadata>): void => {
  scope.createCustomVariable('first', firstFn);
  scope.createCustomVariable('second', secondFn);
  scope.createCustomVariable('print', printFn);
};

const printFn = (scope: Scope<Metadata>, node: Core.Node<Metadata>) => {
  const result = Expression.consumeNode(scope, node);
  console.log(convertToString(result));
  return result;
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
