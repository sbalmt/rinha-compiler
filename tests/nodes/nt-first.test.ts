import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getExpressionTree, getInvocationTree } from '../common/tree';

test('First tuple value', () => {
  const context = Optimizer.run('first((1,2))');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getInvocationTree(
        {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'first'
        },
        {
          kind: NodeTypes.TUPLE,
          fragment: '(1,2)',
          value: [1, 2]
        }
      )
    )
  );
});
