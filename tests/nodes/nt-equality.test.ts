import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getEqualExpressionTree, getNotEqualExpressionTree } from '../common/tree';

test('Equal', () => {
  const context = Optimizer.run('false == false');
  Assertion.matchTree(
    context.node.next!,
    getEqualExpressionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'false',
        value: false
      },
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'false',
        value: false
      }
    )
  );
});

test('Not Equal', () => {
  const context = Optimizer.run('true != true');
  Assertion.matchTree(
    context.node.next!,
    getNotEqualExpressionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      },
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      }
    )
  );
});
