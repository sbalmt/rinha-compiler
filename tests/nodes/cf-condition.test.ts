import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[CF optimized] Define an if/else condition (alway true)', () => {
  const context = Optimizer.run('if (true) { "success" } else { "failure" }', options);
  Assertion.matchTree(context.node.next!, {
    kind: NodeTypes.BLOCK,
    right: getExpressionTree({
      kind: NodeTypes.STRING,
      fragment: '"success"',
      value: 'success'
    })
  });
});

test('[CF optimized] Define an if/else condition (always false)', () => {
  const context = Optimizer.run('if (false) { "success" } else { "failure" }', options);
  Assertion.matchTree(context.node.next!, {
    kind: NodeTypes.BLOCK,
    right: getExpressionTree({
      kind: NodeTypes.STRING,
      fragment: '"failure"',
      value: 'failure'
    })
  });
});

test('[CF optimized] Define an if condition (always true)', () => {
  const context = Optimizer.run('if (true) { "success" }', options);
  Assertion.matchTree(context.node.next!, {
    kind: NodeTypes.BLOCK,
    right: getExpressionTree({
      kind: NodeTypes.STRING,
      fragment: '"success"',
      value: 'success'
    })
  });
});

test('[CF optimized] Define an if condition (always false)', () => {
  const context = Optimizer.run('if (false) { "success" }', options);
  expect(context.node.next).toBeUndefined();
});
