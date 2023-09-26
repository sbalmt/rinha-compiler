import * as Core from '@xcheme/core';

import { Scope, VarValueType } from '../evaluator/scope';

export type NodeMetadata = {
  lazy: boolean;
  tailCall: boolean;
  selfCall: boolean;
  parameters: number;
  pure: boolean;
  value?: VarValueType<Metadata> | Scope<Metadata>;
};

export type SymbolMetadata = {
  mutable: boolean;
  references: number;
  literal?: VarValueType<Metadata>;
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
    node.assign({
      lazy: false,
      tailCall: false,
      selfCall: false,
      parameters: 0,
      pure: true,
      ...initOptions
    });
  }

  return node.data;
};
