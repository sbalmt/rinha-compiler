import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { ErrorTypes } from '../../src/core/types';

const assertInvalidOperation = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.INVALID_OPERATION }]);
};

test('[Error] Unsupported "logical or" operations', () => {
  // LHS
  assertInvalidOperation('         10 || true');
  assertInvalidOperation('     "test" || false');
  assertInvalidOperation('      (1,2) || true');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) || false');

  // RHS
  assertInvalidOperation(' true || 10');
  assertInvalidOperation('false || "test"');
  assertInvalidOperation(' true || (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('false || fn() => 5');
});

test('[Error] Unsupported "logical and" operations', () => {
  // LHS
  assertInvalidOperation('         10 && true');
  assertInvalidOperation('     "test" && false');
  assertInvalidOperation('      (1,2) && true');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) && false');

  // RHS
  assertInvalidOperation(' true && 10');
  assertInvalidOperation('false && "test"');
  assertInvalidOperation(' true && (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('false && fn() => 5');
});
