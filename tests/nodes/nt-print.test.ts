import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getExpressionTree, getInvocationTree } from '../common/tree';

test('Print an integer', () => {
  const context = Optimizer.run('print(10)');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getInvocationTree(
        {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'print'
        },
        {
          kind: NodeTypes.INTEGER,
          fragment: '10',
          value: 10
        }
      )
    )
  );
});
