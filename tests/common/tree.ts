import { NodeTypes } from '../../src/core/types';

import { Tree } from './assertions';

export const getVariableTree = (identifier: string, rightNode: Tree) => {
  return {
    kind: NodeTypes.VARIABLE,
    right: {
      kind: NodeTypes.IDENTIFIER,
      fragment: identifier,
      right: rightNode
    }
  };
};
