import * as Core from '@xcheme/core';

import { Metadata, NodeMetadata, initNode, initSymbol } from './metadata';
import { NodeTypes, SymbolTypes } from './types';

const range = new Core.Range(0, 0);
const location = new Core.Location('built-in', range, range);

export const applyBuiltIn = (table: Core.SymbolTable<Metadata>): void => {
  insertBuiltIn(createFragment('first'), table, { minParams: 1 });
  insertBuiltIn(createFragment('second'), table, { minParams: 1 });
  insertBuiltIn(createFragment('assert'), table, { minParams: 1, maxParams: 2 });
  insertBuiltIn(createFragment('print'), table, { minParams: 1, pure: false });
};

const createFragment = (identifier: string) => {
  return new Core.Fragment(identifier, 0, identifier.length, location);
};

const createParameterNode = (identifier: string, table: Core.SymbolTable<Metadata>) => {
  return new Core.Node(createFragment(identifier), NodeTypes.IDENTIFIER, table);
};

const insertBuiltIn = (fragment: Core.Fragment, table: Core.SymbolTable<Metadata>, options?: Partial<NodeMetadata>) => {
  const current = table.find(fragment);

  if (current) {
    return current;
  }

  const identifierNode = new Core.Node(fragment, NodeTypes.IDENTIFIER, table);
  const closureNode = new Core.Node(fragment, NodeTypes.BUILT_IN, table);
  const closureParameters = new Core.Node(fragment, NodeTypes.PARAMETERS, table);
  const symbol = new Core.SymbolRecord(fragment, SymbolTypes.BuiltIn, identifierNode);

  identifierNode.set(Core.NodeDirection.Right, closureNode);
  closureNode.set(Core.NodeDirection.Right, closureParameters);

  table.insert(symbol);

  initSymbol(symbol);

  const data = initNode(closureNode, options);
  let parameterDirection = Core.NodeDirection.Right;

  for (let index = 0; index < data.maxParams; ++index) {
    const parameterNode = createParameterNode(`arg${index}`, table);
    closureParameters.set(parameterDirection, parameterNode);
    parameterDirection = Core.NodeDirection.Next;
  }

  return symbol;
};
