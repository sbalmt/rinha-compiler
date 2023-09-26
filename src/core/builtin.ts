import * as Core from '@xcheme/core';

import { Metadata, initSymbol } from './metadata';
import { NodeTypes, SymbolTypes } from './types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

const firstFragment = new Core.Fragment('first', 0, 5, location);
const secondFragment = new Core.Fragment('second', 0, 6, location);
const assertFragment = new Core.Fragment('assert', 0, 6, location);
const printFragment = new Core.Fragment('print', 0, 5, location);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  createBuiltInSymbol(firstFragment, table);
  createBuiltInSymbol(secondFragment, table);
  createBuiltInSymbol(assertFragment, table);
  createBuiltInSymbol(printFragment, table);
};

const createBuiltInSymbol = (fragment: Core.Fragment, table: Core.SymbolTable<Metadata>) => {
  const node = new Core.Node(fragment, NodeTypes.CLOSURE, table);
  const symbol = new Core.SymbolRecord(fragment, SymbolTypes.BuiltIn, node);

  initSymbol(symbol, {
    parameters: 1
  });

  table.insert(symbol);

  return symbol;
};
