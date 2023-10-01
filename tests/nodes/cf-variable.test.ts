import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getVariableTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('Define an integer (CF optimized)', () => {
  const context = Optimizer.run('let x = 5 + (5 * 2) - 5;', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '5 + 5 * 2 - 5', // NOTE: This doesn't keep precedence
      value: 10
    })
  );
});

test('Define a single quoted string', () => {
  const context = Optimizer.run("let x = 'hello' + ' ' + 'rinha';", options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      fragment: "'hello' + ' ' + 'rinha'",
      value: 'hello rinha'
    })
  );
});

test('Define a double quoted string', () => {
  const context = Optimizer.run('let x = "hello" + " " + "rinha";', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.STRING,
      fragment: '"hello" + " " + "rinha"',
      value: 'hello rinha'
    })
  );
});

test('Define a boolean (false)', () => {
  const context = Optimizer.run('let x = false == true;', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      fragment: 'false == true',
      value: false
    })
  );
});

test('Define a boolean (true)', () => {
  const context = Optimizer.run('let x = true != false;', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.BOOLEAN,
      fragment: 'true != false',
      value: true
    })
  );
});

test('Define a tuple', () => {
  const context = Optimizer.run('let x = (1 + 1, ("a" + "b", "c" + "d"));', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.TUPLE,
      fragment: '(1 + 1, ("a" + "b", "c" + "d"))',
      value: [2, ['ab', 'cd']]
    })
  );
});
