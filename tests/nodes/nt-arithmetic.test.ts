import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import {
  getAdditionTree,
  getDivisionTree,
  getModuloExpressionTree,
  getMultiplicationTree,
  getSubExpressionTree
} from '../common/tree';

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
