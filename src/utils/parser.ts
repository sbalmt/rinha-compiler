import * as Core from '@xcheme/core';

import { ErrorTypes } from '../core/types';
import { Parser } from './rinha';

export const consumeTokens = <T extends Core.Types>(tokens: Core.TokenList<T>, context: Core.Context<T>) => {
  const tokenSource = new Core.TokenSource(tokens, context);

  if (!Parser.consume(tokenSource)) {
    const fragment = tokens.at(tokenSource.longestState.offset)?.fragment ?? tokenSource.fragment;
    context.logs.emplace(Core.LogType.ERROR, fragment, ErrorTypes.UNEXPECTED_SYNTAX);
  }

  return !context.logs.count(Core.LogType.ERROR);
};
