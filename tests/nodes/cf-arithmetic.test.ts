import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[Constant Folding] Addition & Subtraction', () => {
  const context = Optimizer.run('10 + 20 - 30', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.INTEGER,
      fragment: '10 + 20 - 30',
      value: 0
    })
  );
});

test('[Constant Folding] Multiplication, Division & Modulo', () => {
  const context = Optimizer.run('11 * 21 / 31 % 41', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.INTEGER,
      fragment: '11 * 21 / 31 % 41',
      value: 7
    })
  );
});
