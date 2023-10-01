import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('Logical Or (CF optimized)', () => {
  const context = Optimizer.run('false || true', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'false || true',
      value: true
    })
  );
});

test('Logical And (CF optimized)', () => {
  const context = Optimizer.run('true && false', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'true && false',
      value: false
    })
  );
});

test('Equal (CF optimized)', () => {
  const context = Optimizer.run('false == false', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'false == false',
      value: true
    })
  );
});

test('Not Equal (CF optimized)', () => {
  const context = Optimizer.run('true != true', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'true != true',
      value: false
    })
  );
});

test('Greater Than (CF optimized)', () => {
  const context = Optimizer.run('10 > 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 > 5',
      value: true
    })
  );
});

test('Less Than (CF optimized)', () => {
  const context = Optimizer.run('10 < 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 < 5',
      value: false
    })
  );
});

test('Greater Than or Equal (CF optimized)', () => {
  const context = Optimizer.run('10 >= 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 >= 5',
      value: true
    })
  );
});

test('Less Than or Equal (CF optimized)', () => {
  const context = Optimizer.run('10 <= 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 <= 5',
      value: false
    })
  );
});

test('Addition & Subtraction (CF optimized)', () => {
  const context = Optimizer.run('10 + 20 - 30', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.INTEGER,
      fragment: '10 + 20 - 30',
      value: 0
    })
  );
});

test('Multiplication, Division & Modulo (CF optimized)', () => {
  const context = Optimizer.run('11 * 21 / 31 % 41', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.INTEGER,
      fragment: '11 * 21 / 31 % 41',
      value: 7
    })
  );
});
