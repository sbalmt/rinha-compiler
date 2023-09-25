import * as Core from '@xcheme/core';

import * as Expression from './nodes/expression';

import { Metadata } from '../core/metadata';
import { BaseScope, BaseScopeOptions } from '../core/scope';
import { LazyCall } from './lazy';

export type VarCallableType<T extends Metadata> = Core.Node<T> | VarCallbackType<T>;

export type VarCallbackType<T extends Metadata> = (scope: Scope<T>, args: Core.Node<T>) => VarValueType<T>;

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

  createCustomVariable(identifier: string, callback: VarCallbackType<T>): void {
    this.variables[identifier] = callback;
  }

  createVariable(node: Core.Node<T>, value: VarValueType<T>): void {
    const identifier = node.fragment.data;

    this.variables[identifier] = value;
  }

  updateVariable(node: Core.Node<T>, value: VarValueType<T>): VarValueType<T> {
    const identifier = node.fragment.data;

    if (identifier in this.variables) {
      return (this.variables[identifier] = value);
    }

    if (this.parent) {
      return this.parent.updateVariable(node, value);
    }

    return value;
  }

  readVariable(node: Core.Node<T>): VarValueType<T> {
    const identifier = node.fragment.data;

    if (identifier in this.variables) {
      return this.variables[identifier];
    }

    if (this.parent) {
      return this.parent.readVariable(node);
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

export const createCallScope = (
  parent: Scope<Metadata>,
  closureNode: Core.Node<Metadata>,
  parameterNode: Core.Node<Metadata>,
  argumentNode: Core.Node<Metadata>
) => {
  const callScope = closureNode.data.value as Scope<Metadata>;
  const scope = new Scope(callScope, callScope.options);

  while (parameterNode && argumentNode) {
    const argumentValue = Expression.consumeNode(parent, argumentNode);
    scope.createVariable(parameterNode, argumentValue);

    parameterNode = parameterNode.next!;
    argumentNode = argumentNode.next!;
  }

  return scope;
};
