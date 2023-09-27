import * as Core from '@xcheme/core';

import { Metadata, NodeMetadata, initNode, initSymbol } from './metadata';
import { NodeTypes, SymbolTypes } from './types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

const firstFragment = new Core.Fragment('first', 0, 5, location);
const secondFragment = new Core.Fragment('second', 0, 6, location);
const assertFragment = new Core.Fragment('assert', 0, 6, location);
const printFragment = new Core.Fragment('print', 0, 5, location);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  insertBuiltIn(firstFragment, table, { minParams: 1 });
  insertBuiltIn(secondFragment, table, { minParams: 1 });
  insertBuiltIn(assertFragment, table, { minParams: 1, maxParams: 2 });
  insertBuiltIn(printFragment, table, { minParams: 1, pure: false });
};

const insertBuiltIn = (fragment: Core.Fragment, table: Core.SymbolTable<Metadata>, options?: Partial<NodeMetadata>) => {
  const identifierNode = new Core.Node(fragment, NodeTypes.IDENTIFIER, table);
  const closureNode = new Core.Node(fragment, NodeTypes.BUILT_IN, table);
  const symbol = new Core.SymbolRecord(fragment, SymbolTypes.BuiltIn, identifierNode);

  identifierNode.set(Core.NodeDirection.Right, closureNode);

  initNode(closureNode, options);
  initSymbol(symbol);

  table.insert(symbol);

  return symbol;
};
