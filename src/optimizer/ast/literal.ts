import * as Core from '@xcheme/core';

import { VarValueType } from '../../evaluator/scope';
import { Metadata } from '../../core/metadata';

export const consumeNode = (node: Core.Node<Metadata>) => {
  return node.data.value as VarValueType<Metadata>;
};
