import { NodeTypes } from '../types';

export type OperationType = NodeTypes.LOGICAL_OR | NodeTypes.LOGICAL_AND;

export type ValueType = boolean;

export const isCompatible = (lhs: ValueType, rhs: ValueType) => {
  return typeof lhs === typeof rhs;
};

export const isComparable = (value: unknown): value is ValueType => {
  return typeof value === 'boolean';
};

export const evaluate = (lhs: ValueType, rhs: ValueType, operation: OperationType) => {
  switch (operation) {
    case NodeTypes.LOGICAL_OR:
      return lhs || rhs;

    case NodeTypes.LOGICAL_AND:
      return lhs && rhs;
  }
};
