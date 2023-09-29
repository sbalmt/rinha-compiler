import * as Core from '@xcheme/core';

import { Metadata } from './metadata';
import { Scope } from '../evaluator/scope';

export type TupleTypes = [ValueTypes, ValueTypes];

export type CallbackTypes = (scope: Scope, callee: Core.Node<Metadata>) => ValueTypes;

export type InternalTypes = CallbackTypes | Core.Node<Metadata> | Generator<ValueTypes>;

export type ValueTypes = undefined | string | number | boolean | TupleTypes | InternalTypes;

export const enum ErrorTypes {
  DUPLICATE_IDENTIFIER = 0x100,
  UNEXPECTED_TOKEN,
  UNEXPECTED_SYNTAX,
  UNDEFINED_IDENTIFIER,
  INVALID_TUPLE,
  INVALID_CALL,
  INVALID_ASSIGNMENT,
  INVALID_OPERATION,
  UNSUPPORTED_OPERATION,
  UNSUPPORTED_REFERENCE,
  MISSING_ARGUMENT,
  EXTRA_ARGUMENT,
  ASSERTION_FAILED
}

export const enum SymbolTypes {
  Identifier = 2000,
  Parameter = 2001,
  BuiltIn = 2002
}

export const enum NodeTypes {
  IDENTIFIER = 1100,
  INTEGER = 1101,
  STRING = 1102,
  BOOLEAN = 1103,
  CLOSURE = 1104,
  TUPLE = 1105,
  TERNARY = 1106,

  ASSIGNMENT = 1200,
  LOGICAL_OR = 1201,
  LOGICAL_AND = 1202,
  EQUAL = 1203,
  NOT_EQUAL = 1204,
  GREATER_THAN = 1205,
  LESS_THAN = 1206,
  GREATER_THAN_OR_EQUAL = 1207,
  LESS_THAN_OR_EQUAL = 1208,
  ADD = 1209,
  SUBTRACT = 1210,
  MULTIPLY = 1211,
  DIVIDE = 1212,
  MODULO = 1213,
  INVOKE = 1214,

  EXPRESSION = 1300,
  VARIABLE = 1301,
  IF_ELSE = 1302,

  CONDITION = 1400,
  PARAMETERS = 1401,
  BLOCK = 1402,

  BUILT_IN = 1600
}
