import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import {
  getAdditionTree,
  getDivisionTree,
  getEqualExpressionTree,
  getGreaterThanExpressionTree,
  getGreaterThanOrEqualExpressionTree,
  getLessThanExpressionTree,
  getLessThanOrEqualExpressionTree,
  getLogicalAndExpressionTree,
  getLogicalOrExpressionTree,
  getModuloExpressionTree,
  getMultiplicationTree,
  getNotEqualExpressionTree,
  getSubExpressionTree
} from '../common/tree';

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

test('Addition & Subtraction', () => {
  const context = Optimizer.run('10 + 20 - 30');
  Assertion.matchTree(
    context.node.next!,
    getSubExpressionTree(
      getAdditionTree(
        {
          kind: NodeTypes.INTEGER,
          fragment: '10',
          value: 10
        },
        {
          kind: NodeTypes.INTEGER,
          fragment: '20',
          value: 20
        }
      ),
      {
        kind: NodeTypes.INTEGER,
        fragment: '30',
        value: 30
      }
    )
  );
});

test('Multiplication, Division & Modulo', () => {
  const context = Optimizer.run('11 * 21 / 31 % 41');
  Assertion.matchTree(
    context.node.next!,
    getModuloExpressionTree(
      getDivisionTree(
        getMultiplicationTree(
          {
            kind: NodeTypes.INTEGER,
            fragment: '11',
            value: 11
          },
          {
            kind: NodeTypes.INTEGER,
            fragment: '21',
            value: 21
          }
        ),
        {
          kind: NodeTypes.INTEGER,
          fragment: '31',
          value: 31
        }
      ),
      {
        kind: NodeTypes.INTEGER,
        fragment: '41',
        value: 41
      }
    )
  );
});
