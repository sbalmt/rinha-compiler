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

test('[Error] Unsupported addition operations', () => {
  // LHS
  assertInvalidOperation(' true + 10');
  assertInvalidOperation('(1,2) + 10');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) + 10');

  // RHS
  assertInvalidOperation('10 + false');
  assertInvalidOperation('10 + (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('10 + fn() => 5');
});

test('[Error] Unsupported subtraction operations', () => {
  //LHS
  assertUnsupportedOperation('"test" - 20');
  assertInvalidOperation('      true - 20');
  assertInvalidOperation('     (1,2) - 20');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) - 20');

  // RHS
  assertUnsupportedOperation('20 - "test"');
  assertInvalidOperation('    20 - true');
  assertInvalidOperation('    20 - (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('20 - fn() => 5');
});

test('[Error] Unsupported multiplication operations', () => {
  //LHS
  assertUnsupportedOperation('"test" * 30');
  assertInvalidOperation('      true * 30');
  assertInvalidOperation('     (1,2) * 30');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) * 30');

  // RHS
  assertUnsupportedOperation('30 * "test"');
  assertInvalidOperation('    30 * true');
  assertInvalidOperation('    30 * (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('30 * fn() => 5');
});

test('[Error] Unsupported division operations', () => {
  //LHS
  assertUnsupportedOperation('"test" / 40');
  assertInvalidOperation('      true / 40');
  assertInvalidOperation('     (1,2) / 40');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) * 40');

  // RHS
  assertUnsupportedOperation('40 / "test"');
  assertInvalidOperation('    40 / true');
  assertInvalidOperation('    40 / (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('40 / fn() => 5');
});

test('[Error] Unsupported modulo operations', () => {
  //LHS
  assertUnsupportedOperation('"test" % 50');
  assertInvalidOperation('      true % 50');
  assertInvalidOperation('     (1,2) % 50');

  // TODO: Make this work
  // assertInvalidOperation('(fn() => 5) % 50');

  // RHS
  assertUnsupportedOperation('50 % "test"');
  assertInvalidOperation('    50 % true');
  assertInvalidOperation('    50 % (1,2)');

  // TODO: Make this work
  // assertInvalidOperation('50 % fn() => 5');
});
