import * as Core from '@xcheme/core';

import { serializeString } from './string';
import { Metadata } from './metadata';
import { NodeTypes } from './types';

const MaxLength = 40;

const formatString = (string: string) => {
  return serializeString(string.length > MaxLength ? `${string.substring(0, MaxLength).trim()}...` : string);
};

const getExtraDetails = (node: Core.Node<Metadata>) => {
  if (node.value === NodeTypes.IDENTIFIER) {
    const symbol = node.table.find(node.fragment);
    const { references, mutable } = symbol!.data;

    return `[RC: ${references ?? '?'}, IM: ${mutable ? 'F' : 'T'}]`;
  }

  return '';
};

export const printNodes = (node: Core.Node<Metadata>, level: string = '', direction: string = 'T') => {
  const innerLevel = `${level}   `;

  while (node) {
    const fragment = node.fragment;

    console.log(`${level} ${direction} ${node.value} ${getExtraDetails(node)} ${formatString(fragment.data)}`);

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
