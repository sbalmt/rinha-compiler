import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getVariableTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[Constant Folding] Define an integer', () => {
  const context = Optimizer.run('let x = 5 + (5 * 2) - 5;', options);
  Assertion.matchTree(
    context.node.next!,
    getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '5 + 5 * 2 - 5', // NOTE: The precedence was kept but isn't explicit.
      value: 10
    })
  );
});

test('[Constant Folding] Define a single quoted string', () => {
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

test('[Constant Folding] Define a double quoted string', () => {
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

test('[Constant Folding] Define a boolean (false)', () => {
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

test('[Constant Folding] Define a boolean (true)', () => {
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

test('[Constant Folding] Define a tuple', () => {
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
