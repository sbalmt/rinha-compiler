import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getClosureTree, getExpressionTree } from '../common/tree';

test('Literal integer', () => {
  const context = Optimizer.run('10');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    })
  );
});

test('Literal quoted string', () => {
  const context = Optimizer.run("'hello rinha'");
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.STRING,
      fragment: "'hello rinha'",
      value: 'hello rinha'
    })
  );
});

test('Literal double quoted string', () => {
  const context = Optimizer.run('"hello rinha"');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.STRING,
      fragment: '"hello rinha"',
      value: 'hello rinha'
    })
  );
});

test('Literal boolean (false)', () => {
  const context = Optimizer.run('false');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'false',
      value: false
    })
  );
});

test('Literal boolean (true)', () => {
  const context = Optimizer.run('true');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'true',
      value: true
    })
  );
});

test('Literal closure', () => {
  const context = Optimizer.run('fn () => false');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree(
        getExpressionTree({
          kind: NodeTypes.BOOLEAN,
          fragment: 'false',
          value: false
        })
      )
    )
  );
});

test('Literal tuple', () => {
  const context = Optimizer.run('(1, (2, 3))');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.TUPLE,
      fragment: '(1, (2, 3))',
      value: [1, [2, 3]]
    })
  );
});
