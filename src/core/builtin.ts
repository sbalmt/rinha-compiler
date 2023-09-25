import * as Core from '@xcheme/core';

import { Metadata } from './metadata';
import { SymbolTypes } from './types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

const firstFragment = new Core.Fragment('first', 0, 5, location);
const secondFragment = new Core.Fragment('second', 0, 6, location);
const assertFragment = new Core.Fragment('assert', 0, 6, location);
const printFragment = new Core.Fragment('print', 0, 5, location);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  table.insert(new Core.SymbolRecord(firstFragment, SymbolTypes.BuiltIn));
  table.insert(new Core.SymbolRecord(secondFragment, SymbolTypes.BuiltIn));
  table.insert(new Core.SymbolRecord(assertFragment, SymbolTypes.BuiltIn));
  table.insert(new Core.SymbolRecord(printFragment, SymbolTypes.BuiltIn));
};
