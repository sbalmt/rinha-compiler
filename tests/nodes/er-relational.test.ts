import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { ErrorTypes } from '../../src/core/types';

const assertInvalidOperation = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.INVALID_OPERATION }]);
};

test('[Error] Unsupported "greater than" operations', () => {
  // LHS
  assertInvalidOperation('  true > 10');
  assertInvalidOperation('"test" > 10');
  assertInvalidOperation(' (1,2) > 10');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) > 10');

  // RHS
  assertInvalidOperation('10 > true');
  assertInvalidOperation('10 > "test"');
  assertInvalidOperation('10 > (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('10 > fn() => 5');
});

test('[Error] Unsupported "less than" operations', () => {
  // LHS
  assertInvalidOperation('  true < 10');
  assertInvalidOperation('"test" < 10');
  assertInvalidOperation(' (1,2) < 10');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) < 10');

  // RHS
  assertInvalidOperation('10 < true');
  assertInvalidOperation('10 < "test"');
  assertInvalidOperation('10 < (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('10 < fn() => 5');
});

test('[Error] Unsupported "greater than or equal" operations', () => {
  // LHS
  assertInvalidOperation('  true >= 10');
  assertInvalidOperation('"test" >= 10');
  assertInvalidOperation(' (1,2) >= 10');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) >= 10');

  // RHS
  assertInvalidOperation('10 >= true');
  assertInvalidOperation('10 >= "test"');
  assertInvalidOperation('10 >= (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('10 => fn() >= 5');
});

test('[Error] Unsupported "less than or equal" operations', () => {
  // LHS
  assertInvalidOperation('  true <= 10');
  assertInvalidOperation('"test" <= 10');
  assertInvalidOperation(' (1,2) <= 10');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) <= 10');

  // RHS
  assertInvalidOperation('10 <= true');
  assertInvalidOperation('10 <= "test"');
  assertInvalidOperation('10 <= (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('10 <= fn() => 5');
});
