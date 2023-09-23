import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';
import { resolveSymbol } from '../symbols';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  if (!scope.assignment) {
    const symbol = resolveSymbol(scope, node);

    if (symbol.node) {
      const valueNode = symbol.node.right!;

      if (valueNode.assigned && valueNode.data.value !== undefined) {
        node.swap(valueNode.clone());
        return valueNode.data.value as VarValueType<Metadata>;
      }
    }

    symbol.data.references++;
  }

  return undefined;
};
