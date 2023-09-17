import * as Core from '@xcheme/core';

import { Scope } from '../../core/scope';

export const Type = 1100;

export const consumeNode = <T extends Core.Types>(scope: Scope<T>, node: Core.Node<T>): any => {
  return scope.readVariable(node);
};
