import { NodeType, NodeTypes, ValueTypes } from '../../src/core/types';

export type Tree = {
  kind: NodeTypes;

  fragment?: string;

  value?: ValueTypes;

  left?: Tree;

  right?: Tree;

  next?: Tree;
};

export const matchTree = (node: NodeType, tree: Tree): void => {
  expect(node.value).toBe(tree.kind);

  if (tree.fragment) {
    expect(node.fragment.data).toBe(tree.fragment);
  }

  if (tree.value) {
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
