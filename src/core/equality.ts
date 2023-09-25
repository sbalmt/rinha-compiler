import { NodeTypes } from './types';

export type OperationType = NodeTypes.EQUAL | NodeTypes.NOT_EQUAL;

export type ValueType = string | number | boolean;

export const isCompatible = (lhs: ValueType, rhs: ValueType) => {
  return typeof lhs === typeof rhs;
};

export const isComparable = (value: unknown): value is ValueType => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

export const evaluate = (lhs: ValueType, rhs: ValueType, operation: OperationType) => {
  switch (operation) {
    case NodeTypes.EQUAL:
      return lhs === rhs;

    case NodeTypes.NOT_EQUAL:
      return lhs !== rhs;
  }
};
