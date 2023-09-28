import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { BaseScope, BaseScopeOptions } from '../core/scope';
import { LazyCall } from './lazy';

export type VarCallableType<T extends Metadata> = Core.Node<T> | VarCallbackType<T>;

export type VarCallbackType<T extends Metadata> = (scope: Scope<T>, callee: Core.Node<T>) => VarValueType<T>;

export type VarSingleType<T extends Metadata> =
  | undefined
  | number
  | string
  | boolean
  | VarCallableType<T>
  | Core.SymbolRecord<T>
  | LazyCall<T>;

export type VarTupleType<T extends Metadata> = [VarValueType<T>, VarValueType<T>];

export type VarValueType<T extends Metadata> = VarSingleType<T> | VarTupleType<T>;

type VarMapType<T extends Metadata> = {
  [identifier: string]: VarValueType<T>;
};

type VarRecordType<T extends Metadata> = {
  identifier: string;
  value: VarValueType<T>;
};

export class Scope<T extends Metadata> extends BaseScope {
  private variables: VarMapType<T> = {};

  private parent: Scope<T> | undefined;

  constructor(parent?: Scope<T>, options?: BaseScopeOptions) {
    super(options);

    this.parent = parent;
  }

  createVariable(identifier: string, value: VarValueType<T>): void {
    this.variables[identifier] = value;
  }

  updateVariable(identifier: string, value: VarValueType<T>): VarValueType<T> {
    if (identifier in this.variables) {
      return (this.variables[identifier] = value);
    }

    if (this.parent) {
      return this.parent.updateVariable(identifier, value);
    }

    return value;
  }

  readVariable(identifier: string): VarValueType<T> {
    if (identifier in this.variables) {
      return this.variables[identifier];
    }

    if (this.parent) {
      return this.parent.readVariable(identifier);
    }

    return undefined;
  }

  *[Symbol.iterator](): Iterator<VarRecordType<T>> {
    for (const identifier in this.variables) {
      yield {
        identifier,
        value: this.variables[identifier]
      };
    }
  }
}
