import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[Constant Folding] Logical Or', () => {
  const context = Optimizer.run('false || true', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'false || true',
      value: true
    })
  );
});

test('[Constant Folding] Logical And', () => {
  const context = Optimizer.run('true && false', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'true && false',
      value: false
    })
  );
});
