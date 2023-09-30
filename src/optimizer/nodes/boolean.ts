import { initNode } from '../../core/metadata';
import { NodeType } from '../../core/types';

export const consumeNode = (node: NodeType) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: node.fragment.data === 'true'
  });

  return data.value;
};
