import * as Core from '@xcheme/core';

import { convertToString } from './data';
import { serializeString } from './string';
import { Metadata } from './metadata';
import { NodeTypes } from './types';

const MaxLength = 40;

const cyanColor = (text: string) => {
  return `\x1b[36m${text}\x1b[0m`;
};
const yellowColor = (text: string) => {
  return `\x1b[33m${text}\x1b[0m`;
};

const grayColor = (text: string) => {
  return `\x1b[90m${text}\x1b[0m`;
};

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

export const printNodes = (
  node: Core.Node<Metadata>,
  levels: string[] = [],
  direction: string = 'T',
  next: boolean = false
) => {
  let level = levels.join('');

  if (levels.length > 0) {
    levels[levels.length - 1] = next ? ' │ ' : '   ';
  }

  while (node) {
    const fragment = node.fragment;

    console.log(
      `${level} ${cyanColor(direction)} ${yellowColor(node.value.toString())} ${getExtraDetails(node)} ${grayColor(
        formatString(fragment.data)
      )}`
    );

    if (node.left) {
      const innerLevels = [...levels, node.right || node.next ? ' ├─' : ' └─'];
      printNodes(node.left, innerLevels, 'L', !!node.next || !!node.right);
    }

    if (node.right) {
      const innerLevels = [...levels, node.next ? ' ├─' : ' └─'];
      printNodes(node.right, innerLevels, 'R', !!node.next);
    }

    level = levels.join('');
    node = node.next!;
    direction = 'N';
  }
};
