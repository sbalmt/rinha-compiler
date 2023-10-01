import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getLogicalAndExpressionTree, getLogicalOrExpressionTree } from '../common/tree';

test('Logical Or', () => {
  const context = Optimizer.run('false || true');
  Assertion.matchTree(
    context.node.next!,
    getLogicalOrExpressionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'false',
        value: false
      },
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      }
    )
  );
});

test('Logical And', () => {
  const context = Optimizer.run('true && false');
  Assertion.matchTree(
    context.node.next!,
    getLogicalAndExpressionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      },
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'false',
        value: false
      }
    )
  );
});
