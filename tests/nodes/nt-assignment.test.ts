import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getAssignmentTree, getExpressionTree, getVariableTree } from '../common/tree';

test('Reassign variable', () => {
  const context = Optimizer.run('let x = 10; x = 20');
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    }),
    next: getExpressionTree(
      getAssignmentTree('x', {
        kind: NodeTypes.INTEGER,
        fragment: '20',
        value: 20
      })
    )
  });
});
