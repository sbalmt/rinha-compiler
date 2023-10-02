import * as Core from '@xcheme/core';
import * as Path from 'path';
import * as FS from 'fs';

import * as Errors from './core/errors';
import * as Optimizer from './optimizer';
import * as Evaluator from './evaluator';
import * as Utils from './utils';

import { applyBuiltIn } from './core/builtin';
import { ErrorTypes } from './core/types';

const contextOptions = {
  errors: {
    duplicateSymbolIdentifier: ErrorTypes.DUPLICATE_IDENTIFIER
  }
};

try {
  const cliOptions = Utils.CLI.getInputArguments();

  const filePath = cliOptions.inputFile;
  const fileName = typeof filePath === 'string' ? Path.basename(filePath) : 'stdin';

  const source = FS.readFileSync(filePath).toString();
  const context = new Core.Context(fileName, contextOptions);

  if (!Utils.Lexer.consumeSource(source, context) || !Utils.Parser.consumeTokens(context.tokens, context)) {
    Errors.printLogs(context.logs);
    process.exit(1);
  }

  applyBuiltIn(context.table);

  const logs = Optimizer.consumeNodes(context.node, {
    debug: cliOptions.debug,
    enableHoisting: cliOptions.enableHoisting,
    constantFolding: cliOptions.constantFolding,
    constantPropagation: cliOptions.constantPropagation,
    enableMemoization: cliOptions.enableMemoization
  });

  if (logs.length > 0) {
    Errors.printLogs(logs);
    process.exit(1);
  }

  Evaluator.consumeNodes(context.node);
} catch (e) {
  console.error(e);
  process.exit(1);
}
