import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import {
  getClosureTree,
  getDummyExpressionTree,
  getExpressionTree,
  getInvocationTree,
  getVariableTree
} from '../common/tree';

const options: Optimizer.Options = {
  enableHoisting: true
};

test('[Hoisting] Closure using a post defined variable', () => {
  const context = Optimizer.run('assert(true) let y = fn () => { x }; let x = 10; assert(false)', options);
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    }),
    next: {
      ...getDummyExpressionTree(true),
      next: {
        ...getVariableTree(
          'y',
          getClosureTree(
            getExpressionTree({
              kind: NodeTypes.IDENTIFIER,
              fragment: 'x'
            })
          )
        ),
        next: getDummyExpressionTree(false)
      }
    }
  });
});

test('[Hoisting] Calling a post defined closure', () => {
  const context = Optimizer.run('x() assert(false) let x = fn () => 20; assert(true)', options);
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree(
      'x',
      getClosureTree(
        getExpressionTree({
          kind: NodeTypes.INTEGER,
          fragment: '20',
          value: 20
        })
      )
    ),
    next: {
      ...getExpressionTree(
        getInvocationTree({
          kind: NodeTypes.IDENTIFIER,
          fragment: 'x'
        })
      ),
      next: {
        ...getDummyExpressionTree(false),
        next: getDummyExpressionTree(true)
      }
    }
  });
});

test('[Hoisting] Closure calling a post defined closure', () => {
  const context = Optimizer.run('assert(true) fn () => { x() } let x = fn () => 30; assert(false) ', options);
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree(
      'x',
      getClosureTree(
        getExpressionTree({
          kind: NodeTypes.INTEGER,
          fragment: '30',
          value: 30
        })
      )
    ),
    next: {
      ...getDummyExpressionTree(true),
      next: {
        ...getExpressionTree(
          getClosureTree(
            getExpressionTree(
              getInvocationTree({
                kind: NodeTypes.IDENTIFIER,
                fragment: 'x'
              })
            )
          )
        ),
        next: getDummyExpressionTree(false)
      }
    }
  });
});

test('[Hoisting] Variable inside a closure', () => {
  const context = Optimizer.run('fn () => { assert(false) let x = y; assert(true) let y = 40; }', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree({
        ...getVariableTree('y', {
          kind: NodeTypes.INTEGER,
          fragment: '40',
          value: 40
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
      })
    )
  );
});
