import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getVariableTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('Define an integer (CF optimized)', () => {
  const context = Optimizer.run('let x = 10;', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.INTEGER,
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
      value: true
    })
  );
});

test('Define a tuple', () => {
  const context = Optimizer.run('let x = (2, ("a", "b"));');
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.TUPLE,
      value: [2, ['a', 'b']]
    })
  );
});
