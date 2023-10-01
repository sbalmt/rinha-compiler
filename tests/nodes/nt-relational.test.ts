import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import {
  getGreaterThanExpressionTree,
  getGreaterThanOrEqualExpressionTree,
  getLessThanExpressionTree,
  getLessThanOrEqualExpressionTree
} from '../common/tree';

test('Greater Than', () => {
  const context = Optimizer.run('10 > 5');
  Assertion.matchTree(
    context.node.next!,
    getGreaterThanExpressionTree(
      {
        kind: NodeTypes.INTEGER,
        fragment: '10',
        value: 10
      },
      {
        kind: NodeTypes.INTEGER,
        fragment: '5',
        value: 5
      }
    )
  );
});

test('Less Than', () => {
  const context = Optimizer.run('10 < 5');
  Assertion.matchTree(
    context.node.next!,
    getLessThanExpressionTree(
      {
        kind: NodeTypes.INTEGER,
        fragment: '10',
        value: 10
      },
      {
        kind: NodeTypes.INTEGER,
        fragment: '5',
        value: 5
      }
    )
  );
});

test('Greater Than or Equal', () => {
  const context = Optimizer.run('10 >= 5');
  Assertion.matchTree(
    context.node.next!,
    getGreaterThanOrEqualExpressionTree(
      {
        kind: NodeTypes.INTEGER,
        fragment: '10',
        value: 10
      },
      {
        kind: NodeTypes.INTEGER,
        fragment: '5',
        value: 5
      }
    )
  );
});

test('Less Than or Equal', () => {
  const context = Optimizer.run('10 <= 5');
  Assertion.matchTree(
    context.node.next!,
    getLessThanOrEqualExpressionTree(
      {
        kind: NodeTypes.INTEGER,
        fragment: '10',
        value: 10
      },
      {
        kind: NodeTypes.INTEGER,
        fragment: '5',
        value: 5
      }
    )
  );
});
