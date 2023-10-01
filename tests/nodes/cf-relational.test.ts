import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[Constant Folding] Greater Than', () => {
  const context = Optimizer.run('10 > 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 > 5',
      value: true
    })
  );
});

test('[Constant Folding] Less Than', () => {
  const context = Optimizer.run('10 < 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 < 5',
      value: false
    })
  );
});

test('[Constant Folding] Greater Than or Equal', () => {
  const context = Optimizer.run('10 >= 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 >= 5',
      value: true
    })
  );
});

test('[Constant Folding] Less Than or Equal', () => {
  const context = Optimizer.run('10 <= 5', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: '10 <= 5',
      value: false
    })
  );
});
