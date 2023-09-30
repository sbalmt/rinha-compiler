import { initNode } from '../../core/metadata';
import { convertToNumber, ensureInt32 } from '../../core/data';
import { NodeType } from '../../core/types';

export const consumeNode = (node: NodeType) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: ensureInt32(convertToNumber(node.fragment.data))
  });

  return data.value;
};
