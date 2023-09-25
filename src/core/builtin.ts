import * as Core from '@xcheme/core';

import { Metadata, initSymbol } from './metadata';
import { SymbolTypes } from './types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

const firstFragment = new Core.Fragment('first', 0, 5, location);
const secondFragment = new Core.Fragment('second', 0, 6, location);
const assertFragment = new Core.Fragment('assert', 0, 6, location);
const printFragment = new Core.Fragment('print', 0, 5, location);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  table.insert(createBuiltInSymbol(firstFragment));
  table.insert(createBuiltInSymbol(secondFragment));
  table.insert(createBuiltInSymbol(assertFragment));
  table.insert(createBuiltInSymbol(printFragment));
};

const createBuiltInSymbol = (fragment: Core.Fragment) => {
  const symbol = new Core.SymbolRecord(fragment, SymbolTypes.BuiltIn);

  initSymbol(symbol, {
    parameters: 1
  });

  return symbol;
};
