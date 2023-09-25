import { ArithmeticNodeTypes, ComparisonNodeTypes, NodeTypes } from './types';
import { ensureInt32 } from './converters';
import { VarValueType } from '../evaluator/scope';
import { Metadata } from './metadata';

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

export const resolveComparisonOperation = (
  lhs: VarValueType<Metadata>,
  rhs: VarValueType<Metadata>,
  operations: ComparisonNodeTypes
) => {
  switch (operations) {
    case NodeTypes.LOGICAL_OR:
      return lhs !== false || rhs !== false;

    case NodeTypes.LOGICAL_AND:
      return lhs !== false && rhs !== false;

    case NodeTypes.EQUAL:
      return lhs === rhs;

    case NodeTypes.NOT_EQUAL:
      return lhs !== rhs;

    case NodeTypes.GREATER_THAN:
      return lhs! > rhs!;

    case NodeTypes.LESS_THAN:
      return lhs! < rhs!;

    case NodeTypes.GREATER_THAN_OR_EQUAL:
      return lhs! >= rhs!;

    case NodeTypes.LESS_THAN_OR_EQUAL:
      return lhs! <= rhs!;
  }
};
