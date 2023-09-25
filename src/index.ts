import * as Core from '@xcheme/core';
import * as Path from 'path';
import * as FS from 'fs';

import * as Errors from './core/errors';
import * as Evaluator from './evaluator';
import * as Analysis from './optimizer/analysis';
import * as Optimizer from './optimizer';

import { consumeSource, consumeTokens } from './utils';
import { applyBuiltIn } from './core/builtin';
import { ErrorTypes } from './core/types';

const filePath = process.argv[2] || 0;
const fileName = filePath !== 0 ? Path.basename(filePath) : 'stdin';
const source = FS.readFileSync(filePath).toString();

const context = new Core.Context(fileName, {
  errors: {
    duplicateSymbolIdentifier: ErrorTypes.DUPLICATE_IDENTIFIER
  }
});

if (!consumeSource(source, context) || !consumeTokens(context.tokens, context)) {
  Errors.printLogs(context.logs);
  process.exit(1);
}

if (context.node.next) {
  try {
    applyBuiltIn(context.table);

    Analysis.consumeNodes(context.node, {
      enableHoisting: true,
      removeDeadCode: true
    });

    Optimizer.consumeNodes(context.node.next);
    Evaluator.consumeNodes(context.node.next);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
