import * as Core from '@xcheme/core';

import { ErrorTypes, NodeType, NodeTypes, ValueTypes } from '../../src/core/types';

export type Tree = {
  kind: NodeTypes;

  fragment?: string;

  value?: ValueTypes;

  left?: Tree;

  right?: Tree;

  next?: Tree;
};

export const matchTree = (node: NodeType, tree: Tree) => {
  expect(node).toBeDefined();
  expect(node.value).toBe(tree.kind);

  if (tree.fragment !== undefined) {
    expect(node.fragment.data).toBe(tree.fragment);
  }

  if (tree.value !== undefined) {
    expect(node.assigned).toBeTruthy();
    expect(node.data.value).toBeDefined();
    expect(node.data.value).toStrictEqual(tree.value);
  }

  if (tree.left) {
    expect(node.left).toBeDefined();
    matchTree(node.left!, tree.left);
  } else {
    expect(node.left).toBeUndefined();
  }

  if (tree.right) {
    expect(node.right).toBeDefined();
    matchTree(node.right!, tree.right);
  } else {
    expect(node.right).toBeUndefined();
  }

  if (tree.next) {
    expect(node.next).toBeDefined();
    matchTree(node.next!, tree.next);
  } else {
    expect(node.next).toBeUndefined();
  }
};

export type Error = {
  code: ErrorTypes;

  column?: [number, number];

  line?: [number, number];
};

export const matchErrors = (logs: Core.LogList, errors: Error[]) => {
  expect(logs).toHaveLength(errors.length);

  for (let index = 0; index < errors.length; ++index) {
    const source = logs.at(index)!;
    const target = errors[index];

    expect(source.value).toBe(target.code);

    if (target.line) {
      const line = source.fragment.location.line;
      expect(line.begin).toBe(target.line[0]);
      expect(line.end).toBe(target.line[1]);
    }

    if (target.column) {
      const column = source.fragment.location.column;
      expect(column.begin).toBe(target.column[0]);
      expect(column.end).toBe(target.column[1]);
    }
  }
};
