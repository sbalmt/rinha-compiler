import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getConditionTree, getDummyExpressionTree, getVariableTree } from '../common/tree';

const options: Optimizer.Options = {
  enableHoisting: true
};

test('[Hoisting] Cyclic variable references', () => {
  const context = Optimizer.run('assert(true) let x = y; let y = x; assert(false)', options);
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree('y', {
      kind: NodeTypes.IDENTIFIER,
      fragment: 'x'
    }),
    next: {
      ...getDummyExpressionTree(true),
      next: {
        ...getVariableTree('x', {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'y'
        }),
        next: getDummyExpressionTree(false)
      }
    }
  });
});

test('[Hoisting] Variable referencing a post defined variable', () => {
  const context = Optimizer.run('let x = y; assert(false) let y = 10; assert(true)', options);
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree('y', {
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    }),
    next: {
      ...getVariableTree('x', {
        kind: NodeTypes.IDENTIFIER,
        fragment: 'y'
      }),
      next: {
        ...getDummyExpressionTree(false),
        next: getDummyExpressionTree(true)
      }
    }
  });
});

test('[Hoisting] Variable referencing a post defined variable', () => {
  const context = Optimizer.run('if (true) { assert(false) let x = y; assert(true) let y = 10; }', options);
  Assertion.matchTree(
    context.node.next!,
    getConditionTree(
      {
        kind: NodeTypes.BOOLEAN,
        fragment: 'true',
        value: true
      },
      {
        ...getVariableTree('y', {
          kind: NodeTypes.INTEGER,
          fragment: '10',
          value: 10
        }),
        next: {
          ...getDummyExpressionTree(false),
          next: {
            ...getVariableTree('x', {
              kind: NodeTypes.IDENTIFIER,
              fragment: 'y'
            }),
            next: getDummyExpressionTree(true)
          }
        }
      }
    )
  );
});
