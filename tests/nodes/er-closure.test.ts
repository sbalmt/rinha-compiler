import * as Optimizer from '../common/optimizer';
import * as Assertion from '../common/assertions';

import { ErrorTypes } from '../../src/core/types';

const assertExtraArgument = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.EXTRA_ARGUMENT }]);
};

const assertMissingArgument = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.MISSING_ARGUMENT }]);
};

const assertUnsupportedReference = (source: string) => {
  const context = Optimizer.run(source);
  Assertion.matchErrors(context.logs, [{ code: ErrorTypes.UNSUPPORTED_REFERENCE }]);
};

test('[Error] Call with extra argument not needed', () => {
  assertExtraArgument('(fn () => "test")(10)');
  assertExtraArgument('(fn (x) => x + "test")(10, 20)');
});

test('[Error] Call missing argument', () => {
  assertMissingArgument('(fn (x) => x + "test")()');
  assertMissingArgument('(fn (x, y) => x + "test" + y)(10)');
});

test('[Error] Unable to bind undefined variable (only when hoisting is disabled)', () => {
  assertUnsupportedReference('(fn () => z)() let z = 5;');
  assertUnsupportedReference('(fn () => { fn () => z })()() let z = 5;');
});
