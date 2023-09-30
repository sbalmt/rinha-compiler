import { NodeTypes } from '../types';
import { ensureInt32 } from '../data';

export type OperationType =
  | NodeTypes.ADD
  | NodeTypes.SUBTRACT
  | NodeTypes.MULTIPLY
  | NodeTypes.DIVIDE
  | NodeTypes.MODULO;

export type ValueType = number;

export const isCompatible = (lhs: ValueType, rhs: ValueType) => {
  return typeof lhs === typeof rhs;
};

export const isPerformable = (value: unknown): value is ValueType => {
  return typeof value === 'number';
};

export const evaluate = (lhs: number, rhs: number, operation: OperationType) => {
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
