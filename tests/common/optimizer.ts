import * as Core from '@xcheme/core';

import * as Optimizer from '../../src/optimizer';
import * as Utils from '../../src/utils';

import { ErrorTypes } from '../../src/core/types';
import { applyBuiltIn } from '../../src/core/builtin';
import { ScopeOptions } from '../../src/optimizer/scope';

export type Options = Omit<ScopeOptions, 'debug'>;

const contextOptions = {
  errors: {
    duplicateSymbolIdentifier: ErrorTypes.DUPLICATE_IDENTIFIER
  }
};

export const run = (source: string, options?: Options) => {
  const context = new Core.Context('@tester', contextOptions);

  if (!Utils.Lexer.consumeSource(source, context) || !Utils.Parser.consumeTokens(context.tokens, context)) {
    return context;
  }

  applyBuiltIn(context.table);

  const logs = Optimizer.consumeNodes(context.node, {
    debug: false,
    enableHoisting: false,
    enableMemoization: false,
    constantPropagation: false,
    constantFolding: false,
    ...options
  });

  context.logs.insert(...logs);

  return context;
};
