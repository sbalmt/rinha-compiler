import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../../core/scope';

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): any => {
  return scope.readVariable(node);
};
