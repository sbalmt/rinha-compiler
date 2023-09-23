import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { SymbolTypes } from '../core/types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

const firstFragment = new Core.Fragment('first', 0, 5, location);
const secondFragment = new Core.Fragment('second', 0, 6, location);
const printFragment = new Core.Fragment('print', 0, 5, location);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  table.insert(new Core.SymbolRecord(firstFragment, SymbolTypes.Identifier));
  table.insert(new Core.SymbolRecord(secondFragment, SymbolTypes.Identifier));
  table.insert(new Core.SymbolRecord(printFragment, SymbolTypes.Identifier));
};
