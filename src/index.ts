import * as Core from '@xcheme/core';
import * as Path from 'path';
import * as FS from 'fs';

import * as Errors from './core/errors';
import * as Evaluator from './evaluator';
import * as PreOptimizer from './optimizer/pre';
import * as MidOptimizer from './optimizer/mid';
import * as EndOptimizer from './optimizer/end';

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

try {
  applyBuiltIn(context.table);

  const options = {
    debug: true
  };

  context.node.next && PreOptimizer.consumeNodes(context.node, options);
  context.node.next && MidOptimizer.consumeNodes(context.node.next, options);
  context.node.next && EndOptimizer.consumeNodes(context.node, options);
  context.node.next && Evaluator.consumeNodes(context.node.next, options);
} catch (e) {
  console.error(e);
  process.exit(1);
}
