import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getVariableTree } from '../common/nodes';

test('Define a reference', () => {
  const context = Optimizer.run('let x = print;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.IDENTIFIER,
      value: 'print'
    })
  );
});

test('Define an integer', () => {
  const context = Optimizer.run('let x = 10;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      value: '10'
    })
  );
});

test('Define a single quoted string', () => {
  const context = Optimizer.run("let x = 'hello rinha';");
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      value: "'hello rinha'"
    })
  );
});

test('Define a double quoted string', () => {
  const context = Optimizer.run('let x = "hello rinha";');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      value: '"hello rinha"'
    })
  );
});

test('Define a boolean (false)', () => {
  const context = Optimizer.run('let x = false;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      value: 'false'
    })
  );
});

test('Define a boolean (true)', () => {
  const context = Optimizer.run('let x = true;');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      value: 'true'
    })
  );
});
