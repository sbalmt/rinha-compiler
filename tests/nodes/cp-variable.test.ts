import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getExpressionTree, getInvocationTree } from '../common/tree';

const options: Optimizer.Options = {
  constantPropagation: true
};

// TODO: Make this work
/*
test('[Constant Propagation] Unused reference', () => {
  const context = Optimizer.run('let x = 5;', options);
  expect(context.node.next).toBeUndefined();
});
*/

test('[Constant Propagation] Propagate an unused reference', () => {
  const context = Optimizer.run('let x = 5; let y = x;', options);
  expect(context.node.next).toBeUndefined();
});

test('[Constant Propagation] Propagate an used reference', () => {
  const context = Optimizer.run('let x = 5; let y = x; print(y)', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getInvocationTree(
        {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'print'
        },
        {
          kind: NodeTypes.INTEGER,
          fragment: '5',
          value: 5
        }
      )
    )
  );
});
