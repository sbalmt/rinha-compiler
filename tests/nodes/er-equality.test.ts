import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { ErrorTypes } from '../../src/core/types';

const assertUnsupportedOperation = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.UNSUPPORTED_OPERATION }]);
};

const assertInvalidOperation = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.INVALID_OPERATION }]);
};

test('[Error] Unsupported "equal" operations', () => {
  // LHS
  assertUnsupportedOperation('         10 == true');
  assertUnsupportedOperation('     "test" == false');
  assertInvalidOperation('          (1,2) == true');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) == false');

  // RHS
  assertUnsupportedOperation(' true == 10');
  assertUnsupportedOperation('false == "test"');
  assertInvalidOperation('     true == (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('false == fn() => 5');
});

test('[Error] Unsupported "not equal" operations', () => {
  // LHS
  assertUnsupportedOperation('         10 != true');
  assertUnsupportedOperation('     "test" != false');
  assertInvalidOperation('          (1,2) != true');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) != false');

  // RHS
  assertUnsupportedOperation(' true != 10');
  assertUnsupportedOperation('false != "test"');
  assertInvalidOperation('     true != (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('false != fn() => 5');
});
