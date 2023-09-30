import * as Core from '@xcheme/core';

import { NodeType, RecordType, ValueTypes } from './types';
import { Scope } from '../evaluator/scope';

export type NodeMetadata = {
  scope?: Scope;
  minParams?: number;
  maxParams?: number;
  value?: ValueTypes;
  pure: boolean;
};

export type SymbolMetadata = {
  mutable: boolean;
  references: number;
  literal?: ValueTypes;
  follow?: Core.SymbolRecord<Metadata>;
  hoist: boolean;
};

export type Metadata = {
  token: never;
  record: SymbolMetadata;
  node: NodeMetadata;
};

export const initSymbol = (symbol: RecordType, initOptions?: Partial<SymbolMetadata>) => {
  if (!symbol.assigned) {
    symbol.assign({
      mutable: false,
      references: 0,
      hoist: false,
      ...initOptions
    });
  }

  return symbol.data;
};

export const initNode = (node: NodeType, initOptions?: Partial<NodeMetadata>) => {
  if (!node.assigned) {
    const minParams = initOptions?.minParams ?? 0;
    const maxParams = initOptions?.maxParams ?? minParams;

    node.assign({
      pure: true,
      ...initOptions,
      minParams,
      maxParams
    });
  }

  return node.data;
};
