import { ArithmeticNodeTypes, NodeTypes } from './types';
import { ensureInt32 } from './converters';

export const resolveArithmeticOperation = (lhs: number, rhs: number, operation: ArithmeticNodeTypes) => {
  switch (operation) {
    case NodeTypes.ADD:
      return ensureInt32(lhs + rhs);

    case NodeTypes.SUBTRACT:
      return ensureInt32(lhs - rhs);

    case NodeTypes.MULTIPLY:
      return ensureInt32(lhs * rhs);

    case NodeTypes.DIVIDE:
      return ensureInt32(Math.trunc(lhs / rhs));

    case NodeTypes.MODULO:
      return ensureInt32(lhs % rhs);
  }
};
