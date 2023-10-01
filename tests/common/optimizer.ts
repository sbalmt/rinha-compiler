import * as Core from '@xcheme/core';

import * as Errors from '../../src/core/errors';
import * as Optimizer from '../../src/optimizer';
import * as Utils from '../../src/utils';

import { ErrorTypes } from '../../src/core/types';
import { applyBuiltIn } from '../../src/core/builtin';
import { ScopeOptions } from '../../src/optimizer/scope';

type Options = Omit<ScopeOptions, 'debug'>;

export const run = (source: string, options?: Options) => {
  const context = new Core.Context('@tester', {
    errors: {
      duplicateSymbolIdentifier: ErrorTypes.DUPLICATE_IDENTIFIER
    }
  });

  if (!Utils.Lexer.consumeSource(source, context) || !Utils.Parser.consumeTokens(context.tokens, context)) {
    Errors.printLogs(context.logs);
    return context;
  }

  applyBuiltIn(context.table);

  Optimizer.consumeNodes(context.node, {
    debug: false,
    enableHoisting: false,
    enableMemoization: false,
    constantPropagation: false,
    constantFolding: false,
    ...options
  });

  return context;
};
