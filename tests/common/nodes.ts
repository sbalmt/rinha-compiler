import { NodeTypes } from '../../src/core/types';

import { Tree } from './assertions';

export const getVariableTree = (identifier: string, value: Tree) => {
  return {
    kind: NodeTypes.VARIABLE,
    right: {
      kind: NodeTypes.IDENTIFIER,
      value: identifier,
      right: value
    }
  };
};
