import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { VarValueType } from '../../evaluator/scope';

export const consumeNode = (node: Core.Node<Metadata>) => {
  const identifier = node.fragment.data;
  const symbol = node.table.find(identifier);

  if (symbol?.node) {
    const valueNode = symbol.node.right!;

    if (valueNode.assigned && valueNode.data.value !== undefined) {
      node.swap(valueNode.clone());
      return valueNode.data.value as VarValueType<Metadata>;
    }
  }

  return undefined;
};
