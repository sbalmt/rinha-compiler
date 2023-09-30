import * as Core from '@xcheme/core';

import { convertToString } from './data';
import { serializeString } from './string';
import { Metadata } from './metadata';
import { NodeTypes } from './types';

const MaxLength = 40;

const formatString = (string: string) => {
  return serializeString(string.length > MaxLength ? `${string.substring(0, MaxLength).trim()}...` : string);
};

const getExtraSymbolDetails = (node: Core.Node<Metadata>) => {
  const symbol = node.table.find(node.fragment);
  const { references, mutable } = symbol!.data;
  return `[RC: ${references ?? '?'}, IM: ${mutable ? 'F' : 'T'}]`;
};

const getExtraLiteralDetails = (node: Core.Node<Metadata>) => {
  return `[LV: ${convertToString(node.data.value)}]`;
};

const getExtraDetails = (node: Core.Node<Metadata>) => {
  switch (node.value) {
    case NodeTypes.IDENTIFIER:
      return getExtraSymbolDetails(node);
    case NodeTypes.INTEGER:
    case NodeTypes.STRING:
    case NodeTypes.BOOLEAN:
      return getExtraLiteralDetails(node);
    default:
      return '';
  }
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
