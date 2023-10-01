import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';
import { getExpressionTree, getInvocationTree } from '../common/tree';

test('Assert a value', () => {
  const context = Optimizer.run('assert(true)');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getInvocationTree(
        {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'assert'
        },
        {
          kind: NodeTypes.BOOLEAN,
          fragment: 'true',
          value: true
        }
      )
    )
  );
});

test('Assert a value with custom error', () => {
  const context = Optimizer.run('assert(false, "error message")');
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree(
      getInvocationTree(
        {
          kind: NodeTypes.IDENTIFIER,
          fragment: 'assert'
        },
        {
          kind: NodeTypes.BOOLEAN,
          fragment: 'false',
          value: false,
          next: {
            kind: NodeTypes.STRING,
            fragment: '"error message"',
            value: 'error message'
          }
        }
      )
    )
  );
});
