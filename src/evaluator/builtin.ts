import * as Errors from '../core/errors';

import { CallbackTypes, ErrorTypes, NodeType, RecordType, TableType } from '../core/types';
import { convertToString } from '../core/data';
import { Scope } from './scope';

export const applyBuiltIn = (scope: Scope, table: TableType): void => {
  insertBuiltIn(scope, table.find('first')!, firstFn);
  insertBuiltIn(scope, table.find('second')!, secondFn);
  insertBuiltIn(scope, table.find('assert')!, assertFn);
  insertBuiltIn(scope, table.find('print')!, printFn);
};

const insertBuiltIn = (scope: Scope, symbol: RecordType, callback: CallbackTypes) => {
  const identifierNode = symbol.node!;
  const closureNode = identifierNode.right!;

  scope.createVariable(identifierNode.fragment.data, closureNode);

  closureNode.data.value = callback;
  closureNode.data.scope = scope;
};

const firstFn = (scope: Scope, callee: NodeType) => {
  const tuple = scope.readVariable('arg0');
  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, callee.fragment);
  }
  return tuple[0];
};

const secondFn = (scope: Scope, callee: NodeType) => {
  const tuple = scope.readVariable('arg0');
  if (!(tuple instanceof Array)) {
    throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, callee.fragment);
  }
  return tuple[1];
};

const assertFn = (scope: Scope, callee: NodeType) => {
  const result = scope.readVariable('arg0');
  if (result === false) {
    const error = scope.readVariable('arg1');
    if (typeof error !== 'string') {
      throw Errors.getMessage(ErrorTypes.ASSERTION_FAILED, callee.fragment);
    }
    throw Errors.formatMessage(error, callee.fragment);
  }
  return result;
};

const printFn = (scope: Scope) => {
  const message = scope.readVariable('arg0');
  console.log(convertToString(message));
  return message;
};
