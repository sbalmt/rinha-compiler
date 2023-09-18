import * as Core from '@xcheme/core';
import * as Path from 'path';
import * as FS from 'fs';

import * as Errors from './core/errors';
import * as Expression from './nodes/expression';
import * as Block from './nodes/block';

import { consumeSource, consumeTokens } from './utils';
import { Scope, VarValueType } from './core/scope';
import { convertToString } from './core/converters';

const filePath = process.argv[2] || 0;
const fileName = filePath !== 0 ? Path.basename(filePath) : 'sdtin';
const source = FS.readFileSync(filePath).toString();

const context = new Core.Context(fileName, {
  errors: {
    duplicateSymbolIdentifier: Errors.Types.DUPLICATE_IDENTIFIER
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

const globalScope = new Scope();

globalScope.createCustomVariable(
  'print',
  <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
    const result = Expression.consumeNode(scope, node);
    console.log(convertToString(result));
    return result;
  }
);

globalScope.createCustomVariable(
  'first',
  <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
    const tuple = Expression.consumeNode(scope, node);
    if (!(tuple instanceof Array)) {
      throw Errors.getMessage(Errors.Types.INVALID_TUPLE, node.fragment);
    }
    return tuple[0];
  }
);

globalScope.createCustomVariable(
  'second',
  <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): VarValueType<T> => {
    const tuple = Expression.consumeNode(scope, node);
    if (!(tuple instanceof Array)) {
      throw Errors.getMessage(Errors.Types.INVALID_TUPLE, node.fragment);
    }
    return tuple[1];
  }
);

Block.consumeNodes(globalScope, context.node.next!);
