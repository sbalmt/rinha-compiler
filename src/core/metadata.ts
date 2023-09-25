import * as Core from '@xcheme/core';

import { Scope, VarValueType } from '../evaluator/scope';

export type Metadata = {
  token: never;

  record: {
    mutable: boolean;
    references: number;
    literal?: VarValueType<Metadata>;
    follow?: Core.SymbolRecord<Metadata>;
    hoist: boolean;
  };

  node: {
    pure?: boolean;
    tailCall: boolean;
    selfCall: boolean;
    parameters: number;
    value?: VarValueType<Metadata> | Scope<Metadata>;
  };
};

export const initSymbol = (symbol: Core.SymbolRecord<Metadata>, initOptions?: Partial<Metadata['record']>) => {
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

export const initNode = (node: Core.Node<Metadata>, initOptions?: Partial<Metadata['node']>) => {
  if (!node.assigned) {
    node.assign({
      tailCall: false,
      selfCall: false,
      parameters: 0,
      ...initOptions
    });
  }

  return node.data;
};
