import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { NodeTypes } from '../../src/core/types';

import { getExpressionTree } from '../common/tree';

const options: Optimizer.Options = {
  constantFolding: true
};

test('[Constant Folding] Equal', () => {
  const context = Optimizer.run('false == false', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'false == false',
      value: true
    })
  );
});

test('[Constant Folding] Not Equal', () => {
  const context = Optimizer.run('true != true', options);
  Assertion.matchTree(
    context.node.next!,
    getExpressionTree({
      kind: NodeTypes.BOOLEAN,
      fragment: 'true != true',
      value: false
    })
  );
});
