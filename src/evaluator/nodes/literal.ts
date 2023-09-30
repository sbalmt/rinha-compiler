import { NodeType } from '../../core/types';

export const consumeNode = (node: NodeType) => {
  return node.data.value;
};
