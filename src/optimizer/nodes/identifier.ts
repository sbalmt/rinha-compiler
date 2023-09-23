import * as Core from '@xcheme/core';

import * as Errors from '../../core/errors';

import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';
import { ErrorTypes } from '../../core/types';
import { Scope } from '../scope';

export const consumeNode = (scope: Scope, node: Core.Node<Metadata>) => {
  if (!scope.assigning) {
    const identifier = node.fragment.data;
    const symbol = node.table.find(identifier);

    if (!symbol) {
      throw Errors.getMessage(ErrorTypes.UNDEFINED_IDENTIFIER, node.fragment);
    }

    if (symbol.node) {
      const valueNode = symbol.node.right!;

      if (valueNode.assigned && valueNode.data.value !== undefined) {
        node.swap(valueNode.clone());
        return valueNode.data.value as VarValueType<Metadata>;
      }
    }

    if (!symbol.assigned) {
      symbol.assign({
        references: 0
      });
    }

    symbol.data.references++;
  }

  return undefined;
};
