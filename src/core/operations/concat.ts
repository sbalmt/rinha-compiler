import { convertToString } from '../data';

export type ValueType = string | number;

export const isCompatible = (lhs: ValueType, rhs: ValueType) => {
  return typeof lhs === typeof rhs;
};

export const isPerformable = (value: unknown): value is ValueType => {
  return typeof value === 'string' || typeof value === 'number';
};

export const evaluate = (lhs: ValueType, rhs: ValueType) => {
  return convertToString(lhs) + convertToString(rhs);
};
