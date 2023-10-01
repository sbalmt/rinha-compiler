import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getConditionTree, getExpressionTree } from '../common/tree';

test('Define an if/else condition', () => {
  const context = Optimizer.run('if (true) { "success" } else { "failure" }');
  Assertion.matchTree(
    context.node.next!,
    getConditionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      },
      getExpressionTree({
        kind: NodeTypes.STRING,
        fragment: '"success"',
        value: 'success'
      }),
      getExpressionTree({
        kind: NodeTypes.STRING,
        fragment: '"failure"',
        value: 'failure'
      })
    )
  );
});

test('Define an if condition', () => {
  const context = Optimizer.run('if (true) { "success" }');
  Assertion.matchTree(
    context.node.next!,
    getConditionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      },
      getExpressionTree({
        kind: NodeTypes.STRING,
        fragment: '"success"',
        value: 'success'
      })
    )
  );
});
