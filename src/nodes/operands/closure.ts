import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { Scope } from '../../core/scope';

export const Type = 1104;

export const consumeNode = (scope: Scope<Metadata>, node: Core.Node<Metadata>): Core.Node<Metadata> => {
  if (!node.assigned) {
    node.assign({
      value: scope
    });
  }

  return node;
};
