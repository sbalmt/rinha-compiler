import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import {
  getAddExpressionTree,
  getClosureParametersTree,
  getClosureTree,
  getExpressionTree,
  getInvocationTree,
  getMultiplicationTree,
  getMultiplyExpressionTree,
  getVariableTree
} from '../common/tree';

test('Closure with no parameter and single body', () => {
  const context = Optimizer.run('fn () => "closure"');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree(
        getExpressionTree({
          kind: NodeTypes.STRING,
          fragment: '"closure"',
          value: 'closure'
        })
      )
    )
  );
});

test('Closure with no parameter and block body', () => {
  const context = Optimizer.run('fn () => { let x = "closure"; print(x) }');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree({
        ...getVariableTree('x', {
          kind: NodeTypes.STRING,
          fragment: '"closure"',
          value: 'closure'
        }),
        next: getExpressionTree(
          getInvocationTree(
            {
              kind: NodeTypes.IDENTIFIER,
              fragment: 'print'
            },
            {
              kind: NodeTypes.IDENTIFIER,
              fragment: 'x'
            }
          )
        )
      })
    )
  );
});

test('Closure with parameters and single body', () => {
  const context = Optimizer.run('fn (x, y) => x * y');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree(
        getMultiplyExpressionTree(
          {
            kind: NodeTypes.IDENTIFIER,
            fragment: 'x'
          },
          {
            kind: NodeTypes.IDENTIFIER,
            fragment: 'y'
          }
        ),
        getClosureParametersTree('x', 'y')
      )
    )
  );
});

test('Closure with parameters and block body', () => {
  const context = Optimizer.run('fn (x, y) => { let z = x * y; print(z) }');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getClosureTree(
        {
          ...getVariableTree(
            'z',
            getMultiplicationTree(
              {
                kind: NodeTypes.IDENTIFIER,
                fragment: 'x'
              },
              {
                kind: NodeTypes.IDENTIFIER,
                fragment: 'y'
              }
            )
          ),
          next: getExpressionTree(
            getInvocationTree(
              {
                kind: NodeTypes.IDENTIFIER,
                fragment: 'print'
              },
              {
                kind: NodeTypes.IDENTIFIER,
                fragment: 'z'
              }
            )
          )
        },
        getClosureParametersTree('x', 'y')
      )
    )
  );
});

test('Closure variable binding', () => {
  const context = Optimizer.run('let x = 10; let y = fn () => x + z; let z = 5;');
  Assertion.matchTree(context.node.next!, {
    ...getVariableTree('x', {
      kind: NodeTypes.INTEGER,
      fragment: '10',
      value: 10
    }),
    next: {
      ...getVariableTree(
        'y',
        getClosureTree(
          getAddExpressionTree(
            {
              kind: NodeTypes.IDENTIFIER,
              fragment: 'x'
            },
            {
              kind: NodeTypes.IDENTIFIER,
              fragment: 'z'
            }
          )
        )
      ),
      next: getVariableTree('z', {
        kind: NodeTypes.INTEGER,
        fragment: '5',
        value: 5
      })
    }
  });
});
