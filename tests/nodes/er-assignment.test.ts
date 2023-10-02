import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { ErrorTypes } from '../../src/core/types';

const assertInvalidAssignment = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.INVALID_ASSIGNMENT }]);
};

test('[Error] Unsupported assignment operations', () => {
  assertInvalidAssignment('          5 = 10');
  assertInvalidAssignment('     "test" = 10');
  assertInvalidAssignment('       true = 10');
  assertInvalidAssignment('(fn() => 5) = 10');
  assertInvalidAssignment('      (1,2) = 10');
});

test('[Error] Unable to assign an undefined variable (only when hoisting is disabled)', () => {
  const context = Optimizer.run('x = 10 let x = 5;');
  Assertion.matchErrors(context.logs, [
    {
      code: ErrorTypes.UNSUPPORTED_REFERENCE
    }
  ]);
});
