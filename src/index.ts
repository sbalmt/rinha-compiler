import * as Core from '@xcheme/core';
import * as Path from 'path';
import * as FS from 'fs';

import * as Errors from './core/errors';
import * as Block from './nodes/block';

import { consumeSource, consumeTokens } from './utils';
import { injectBuiltIns } from './core/builtins';
import { ErrorTypes } from './core/types';
import { Scope } from './core/scope';

const filePath = process.argv[2] || 0;
const fileName = filePath !== 0 ? Path.basename(filePath) : 'stdin';
const source = FS.readFileSync(filePath).toString();

const context = new Core.Context(fileName, {
  errors: {
    duplicateSymbolIdentifier: ErrorTypes.DUPLICATE_IDENTIFIER
  }
});

if (!consumeSource(source, context) || !consumeTokens(context.tokens, context)) {
  console.log('ERROR');

  for (const log of context.logs) {
    const location = log.fragment.location;
    console.log(`\t[${location.name}]: ${Errors.getLogMessage(log)}`);
  }

  process.exit(1);
}

if (context.node.next) {
  const globalScope = new Scope();

  injectBuiltIns(globalScope);

  Block.consumeNodes(globalScope, context.node.next!);
}
