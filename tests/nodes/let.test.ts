import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getVariableTree } from '../common/tree';

test('Define a reference', () => {
  const context = Optimizer.run('let x = print;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.IDENTIFIER,
      fragment: 'print',
      value: undefined
    })
  );
});

test('Define an integer', () => {
  const context = Optimizer.run('let x = 10;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    })
  );
});

test('Define a single quoted string', () => {
  const context = Optimizer.run("let x = 'hello rinha';");
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      fragment: "'hello rinha'",
      value: 'hello rinha'
    })
  );
});

test('Define a double quoted string', () => {
  const context = Optimizer.run('let x = "hello rinha";');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      fragment: '"hello rinha"',
      value: 'hello rinha'
    })
  );
});

test('Define a boolean (false)', () => {
  const context = Optimizer.run('let x = false;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      fragment: 'false',
      value: false
    })
  );
});

test('Define a boolean (true)', () => {
  const context = Optimizer.run('let x = true;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      fragment: 'true',
      value: true
    })
  );
});

test('Define a closure', () => {
  const context = Optimizer.run('let x = fn () => 10;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.CLOSURE,
      fragment: 'fn () => 10',
      value: undefined,
      right: {
        kind: NodeTypes.BLOCK,
        next: {
          kind: NodeTypes.BLOCK,
          right: {
            kind: NodeTypes.EXPRESSION,
            right: {
              kind: NodeTypes.INTEGER,
              fragment: '10',
              value: 10
            }
          }
        }
      }
    })
  );
});

test('Define a tuple', () => {
  const context = Optimizer.run('let x = (2, ("a", "b"));');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.TUPLE,
      fragment: '(2, ("a", "b"))',
      value: [2, ['a', 'b']]
    })
  );
});
