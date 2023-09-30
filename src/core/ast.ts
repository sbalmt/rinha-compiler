import * as Core from '@xcheme/core';

import { NodeTypes, ValueTypes } from './types';
import { Metadata, initNode } from './metadata';

export const createNode = (fragment: Core.Fragment, value: NodeTypes, table: Core.SymbolTable<Metadata>) => {
  return new Core.Node(fragment, value, table);
};

export const replaceNode = (node: Core.Node<Metadata>, value: NodeTypes, base?: Core.Node<Metadata>) => {
  const replacement = createNode(base?.fragment ?? node.fragment, value, base?.table ?? node.table);

  replacement.set(Core.NodeDirection.Left, node.left);
  replacement.set(Core.NodeDirection.Right, node.right);
  replacement.set(Core.NodeDirection.Next, node.next);

  if (base?.assigned) {
    replacement.assign(base.data);
  } else if (node.assigned) {
    replacement.assign(node.data);
  }

  node.swap(replacement);

  return node;
};

export const combineNodes = (
  nodes: Core.Node<Metadata>[],
  table: Core.SymbolTable<Metadata>,
  type: NodeTypes,
  value: ValueTypes
): Core.Node<Metadata> => {
  const source = nodes.map((node) => node.fragment.data).join(' ');

  const range = new Core.Range(-1, -1);
  const location = new Core.Location('@optimizer', range, range);
  const fragment = new Core.Fragment(source, 0, source.length, location);

  const node = new Core.Node(fragment, type, table);

  initNode(node, {
    value
  });

  return node;
};
