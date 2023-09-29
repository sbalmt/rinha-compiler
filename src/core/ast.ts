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
  first: Core.Node<Metadata>,
  last: Core.Node<Metadata>,
  type: NodeTypes,
  value: ValueTypes
): Core.Node<Metadata> => {
  const lineRange = new Core.Range(first.fragment.location.line.begin, last.fragment.location.line.end);
  const columnRange = new Core.Range(first.fragment.location.column.begin, last.fragment.location.column.end);

  const location = new Core.Location(first.fragment.location.name, lineRange, columnRange);
  const fragment = new Core.Fragment(first.fragment.source, first.fragment.begin, last.fragment.end, location);

  const node = new Core.Node(fragment, type, first.table);

  initNode(node, {
    value
  });

  return node;
};
