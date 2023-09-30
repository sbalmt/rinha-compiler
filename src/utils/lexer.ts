import * as Core from '@xcheme/core';

import { ErrorTypes } from '../core/types';
import { Lexer } from './rinha';

export const consumeSource = <T extends Core.Types>(source: string, context: Core.Context<T>) => {
  const textSource = new Core.TextSource(source, context);

  if (!Lexer.consume(textSource)) {
    context.logs.emplace(Core.LogType.ERROR, textSource.fragment, ErrorTypes.UNEXPECTED_TOKEN);
  }

  return !context.logs.count(Core.LogType.ERROR);
};
