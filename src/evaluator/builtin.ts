import * as Core from '@xcheme/core';

import * as Errors from '../core/errors';

import { Metadata } from '../core/metadata';
import { ErrorTypes } from '../core/types';
import { convertToString } from '../core/data';
import { Scope, VarCallbackType } from './scope';

export const applyBuiltIn = (scope: Scope<Metadata>, table: Core.SymbolTable<Metadata>): void => {
  insertBuiltIn(scope, table.find('first')!, firstFn);
  insertBuiltIn(scope, table.find('second')!, secondFn);
  insertBuiltIn(scope, table.find('assert')!, assertFn);
  insertBuiltIn(scope, table.find('print')!, printFn);
};

const insertBuiltIn = (
  scope: Scope<Metadata>,
  symbol: Core.SymbolRecord<Metadata>,
  callback: VarCallbackType<Metadata>
) => {
  const identifierNode = symbol.node!;
  const closureNode = identifierNode.right!;

  scope.createVariable(identifierNode.fragment.data, closureNode);

  closureNode.data.value = callback;
  closureNode.data.scope = scope;
};

const firstFn = (scope: Scope<Metadata>, callee: Core.Node<Metadata>) => {
  const tuple = scope.readVariable('arg0');
  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, callee.fragment);
  }
  return tuple[0];
};

const secondFn = (scope: Scope<Metadata>, callee: Core.Node<Metadata>) => {
  const tuple = scope.readVariable('arg0');
  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, callee.fragment);
  }
  return tuple[1];
};

const assertFn = (scope: Scope<Metadata>, callee: Core.Node<Metadata>) => {
  const result = scope.readVariable('arg0');
  if (result !== false) {
    return result;
  }

  const error = scope.readVariable('arg1');
  if (typeof error !== 'string') {
    throw Errors.getMessage(ErrorTypes.ASSERTION_FAILED, callee.fragment);
  }

  throw Errors.formatMessage(error, callee.fragment);
};

const printFn = (scope: Scope<Metadata>, callee: Core.Node<Metadata>) => {
  const message = scope.readVariable('arg0');
  console.log(convertToString(message));
  return message;
};
