import { NodeTypes } from '../types';

export type OperationType =
  | NodeTypes.GREATER_THAN
  | NodeTypes.LESS_THAN
  | NodeTypes.GREATER_THAN_OR_EQUAL
  | NodeTypes.LESS_THAN_OR_EQUAL;

export type ValueType = number;

export const isCompatible = (lhs: ValueType, rhs: ValueType) => {
  return typeof lhs === typeof rhs;
};

export const isComparable = (value: unknown): value is ValueType => {
  return typeof value === 'number';
};

export const evaluate = (lhs: ValueType, rhs: ValueType, operation: OperationType) => {
  switch (operation) {
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
