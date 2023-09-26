import * as Core from '@xcheme/core';

import { serializeString } from './string';

export const printNodes = <T extends Core.Types>(node: Core.Node<T>, level: string = '', direction: string = 'T') => {
  const innerLevel = `${level}   `;

  while (node) {
    const fragment = node.fragment;

    console.log(`${level} ${direction} ${node.value} ${serializeString(fragment.data)}`);

    if (node.left) {
      printNodes(node.left, innerLevel, 'L');
    }

    if (node.right) {
      printNodes(node.right, innerLevel, 'R');
    }

    node = node.next!;
    direction = 'N';
  }
};
