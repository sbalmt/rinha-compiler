import * as Expression from '../nodes/expression';

import * as Errors from './errors';

import { Metadata } from './metadata';
import { convertToString } from './converters';
import { ErrorTypes } from './types';
import { Scope } from './scope';

export const injectBuiltIns = (scope: Scope<Metadata>): void => {
  scope.createCustomVariable('print', (scope, node) => {
    const result = Expression.consumeNode(scope, node);
    console.log(convertToString(result));
    return result;
  });

  scope.createCustomVariable('first', (scope, node) => {
    const tuple = Expression.consumeNode(scope, node);
    if (!(tuple instanceof Array)) {
      throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, node.fragment);
    }
    return tuple[0];
  });

  scope.createCustomVariable('second', (scope, node) => {
    const tuple = Expression.consumeNode(scope, node);
    if (!(tuple instanceof Array)) {
      throw Errors.getMessage(ErrorTypes.INVALID_TUPLE, node.fragment);
    }
    return tuple[1];
  });
};
