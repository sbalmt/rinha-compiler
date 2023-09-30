import * as Core from '@xcheme/core';

import { initNode } from './metadata';
import { NodeType, NodeTypes, TableType, ValueTypes } from './types';

export const createFragment = (source: string) => {
  const range = new Core.Range(-1, -1);

  const location = new Core.Location('@built-in', range, range);
  const fragment = new Core.Fragment(source, 0, source.length, location);

  return fragment;
};

export const replaceNode = (node: NodeType, value: NodeTypes, base?: NodeType) => {
  const replacement = new Core.Node(base?.fragment ?? node.fragment, value, base?.table ?? node.table);

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

export const combineNodes = (nodes: NodeType[], table: TableType, type: NodeTypes, value: ValueTypes): NodeType => {
  const source = nodes.map((node) => node.fragment.data).join(' ');
  const fragment = createFragment(source);
  const node = new Core.Node(fragment, type, table);

  initNode(node, {
    value
  });

  return node;
};
