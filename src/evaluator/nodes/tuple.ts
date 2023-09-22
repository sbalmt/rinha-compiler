import * as Core from '@xcheme/core';

import { Metadata } from '../../core/metadata';
import { VarTupleType } from '../scope';

export const consumeNode = (node: Core.Node<Metadata>) => {
  return node.data.value as VarTupleType<Metadata>;
};
