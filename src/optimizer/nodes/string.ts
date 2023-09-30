import { initNode } from '../../core/metadata';
import { parseString } from '../../utils/string';
import { NodeType } from '../../core/types';

export const consumeNode = (node: NodeType) => {
  if (node.assigned) {
    return node.data.value;
  }

  const data = initNode(node, {
    value: parseString(node.fragment.data)
  });

  return data.value;
};
