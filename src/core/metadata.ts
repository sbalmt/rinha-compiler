import * as Core from '@xcheme/core';

import { Scope } from '../evaluator/scope';
import { ValueTypes } from './types';

export type NodeMetadata = {
  pure: boolean;
  minParams?: number;
  maxParams?: number;
  scope?: Scope;
  symbol?: Core.SymbolRecord<Metadata>;
  value?: ValueTypes;
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

export const initSymbol = (symbol: Core.SymbolRecord<Metadata>, initOptions?: Partial<SymbolMetadata>) => {
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

export const initNode = (node: Core.Node<Metadata>, initOptions?: Partial<NodeMetadata>) => {
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
