import * as Core from '@xcheme/core';

import { ErrorTypes } from './core/types';
import { Lexer, Parser } from './rinha';

export const consumeSource = <T extends Core.Types>(source: string, context: Core.Context<T>): boolean => {
  const textSource = new Core.TextSource(source, context);

  if (!Lexer.consume(textSource)) {
    context.logs.emplace(Core.LogType.ERROR, textSource.fragment, ErrorTypes.UNEXPECTED_TOKEN);
  }

  return !context.logs.count(Core.LogType.ERROR);
};

export const consumeTokens = <T extends Core.Types>(tokens: Core.TokenList<T>, context: Core.Context<T>): boolean => {
  const tokenSource = new Core.TokenSource(tokens, context);

  if (!Parser.consume(tokenSource)) {
    const fragment = tokens.at(tokenSource.longestState.offset)?.fragment ?? tokenSource.fragment;
    context.logs.emplace(Core.LogType.ERROR, fragment, ErrorTypes.UNEXPECTED_SYNTAX);
  }

  return !context.logs.count(Core.LogType.ERROR);
};
